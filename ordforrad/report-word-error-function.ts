import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// These three are auto-provided by Supabase for every Edge Function —
// no need to add them as secrets yourself.
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// These two you add yourself as secrets.
// RESEND_API_KEY: same one already used by invite-friend — reuse it, don't recreate it.
// REPORT_TO_EMAIL: the address error reports should land in (your own inbox).
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const REPORT_TO_EMAIL = Deno.env.get('REPORT_TO_EMAIL');

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://heberlelab.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_REPORTS_PER_DAY = 30;

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  if (!REPORT_TO_EMAIL) {
    console.error('REPORT_TO_EMAIL secret is not set');
    return jsonResponse({ error: 'Felrapportering är inte konfigurerad ännu' }, 500);
  }

  try {
    // 1. Identify the caller from their Supabase session token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) return jsonResponse({ error: 'Not authenticated' }, 401);

    // 2. Read and lightly validate the report body
    const body = await req.json().catch(() => ({}));
    const { wordId, sv, en, t, g, c, es, ee, direction, context, note } = body;
    if (!wordId || !sv) return jsonResponse({ error: 'Ofullständig rapport' }, 400);

    // 3. Rate-limit: max N reports per user per rolling 24h
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from('error_reports')
      .select('*', { count: 'exact', head: true })
      .eq('reporter_user_id', user.id)
      .gte('created_at', since);

    if ((count ?? 0) >= MAX_REPORTS_PER_DAY) {
      return jsonResponse({ error: 'Du har skickat många rapporter idag. Försök igen imorgon.' }, 429);
    }

    // 4. Send the email via Resend
    const reporterLabel = user.email || 'Okänd användare';
    const rows = [
      ['Ord (svenska)', sv],
      ['Översättning', en],
      ['Ordklass', t],
      ['Genus', g],
      ['Böjning', c],
      ['Exempelmening (SV)', es],
      ['Exempelmening (EN)', ee],
      ['Riktning i övningen', direction],
      ['Sammanhang', context],
      ['Ord-ID', wordId],
    ].filter(([, v]) => v !== undefined && v !== null && v !== '');

    const rowsHtml = rows.map(([label, value]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#8a8570;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(value)}</td></tr>`
    ).join('');

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ordförråd <invites@heberlelab.com>',
        to: REPORT_TO_EMAIL,
        subject: `Ordförråd: felrapport för "${sv}"`,
        html: `
          <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #232420;">
            <div style="background:#A23E2A;color:#F3EFE6;display:inline-block;padding:8px 14px;border-radius:6px;font-weight:bold;font-size:18px;margin-bottom:20px;">Felrapport</div>
            <p style="font-size:14px;color:#6b6656;">Rapporterat av <strong>${escapeHtml(reporterLabel)}</strong></p>
            ${note ? `<div style="background:#FBF3E8;border-left:3px solid #C99A2E;padding:12px 16px;margin:16px 0;font-size:14px;">${escapeHtml(note)}</div>` : ''}
            <table style="border-collapse:collapse;margin-top:12px;">${rowsHtml}</table>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend error:', errText);
      return jsonResponse({ error: 'Kunde inte skicka rapporten just nu' }, 502);
    }

    // 5. Log it (for the rate limit check above, and a basic audit trail)
    await adminClient.from('error_reports').insert({ reporter_user_id: user.id, word_id: wordId, sv, note: note || null });

    return jsonResponse({ success: true }, 200);
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: 'Serverfel' }, 500);
  }
});
