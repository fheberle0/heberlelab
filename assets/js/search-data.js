// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "dropdown-overview",
              title: "Overview",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/overview/";
              },
            },{id: "dropdown-domains",
              title: "Domains",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/domains/";
              },
            },{id: "dropdown-asymmetry",
              title: "Asymmetry",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/asymmetry/";
              },
            },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-people",
          title: "People",
          description: "Members of the Heberle Lab",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "nav-resources",
          title: "Resources",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/resources/";
          },
        },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/plotly/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/photo-gallery/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/giscus-comments/";
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "news-news",
          title: 'News',
          description: "Latest news from the Heberle Lab",
          section: "News",handler: () => {
              window.location.href = "/news/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{id: "recipes-authentic-greek-lemon-potatoes",
          title: 'Authentic Greek Lemon Potatoes',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/authentic-greek-lemon-potatoes/";
            },},{id: "recipes-beef-bourguignon",
          title: 'Beef Bourguignon',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/beef-bourguignon/";
            },},{id: "recipes-beef-enchiladas",
          title: 'Beef Enchiladas',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/beef-enchiladas/";
            },},{id: "recipes-the-best-beef-stroganoff",
          title: 'The Best Beef Stroganoff',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/best-beef-stroganoff/";
            },},{id: "recipes-the-best-juicy-skillet-pork-chops",
          title: 'The Best Juicy Skillet Pork Chops',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/best-juicy-skillet-pork-chops/";
            },},{id: "recipes-cheesy-green-chile-bean-bake",
          title: 'Cheesy Green Chile Bean Bake',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/cheesy-green-chile-bean-bake/";
            },},{id: "recipes-chicken-au-poivre",
          title: 'Chicken au Poivre',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/chicken-au-poivre/";
            },},{id: "recipes-chicken-soup",
          title: 'Chicken Soup',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/chicken-soup-mimi/";
            },},{id: "recipes-chocolate-doughnut-muffins",
          title: 'Chocolate Doughnut Muffins',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/chocolate-doughnut-muffins/";
            },},{id: "recipes-cilantro-lime-rice",
          title: 'Cilantro Lime Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/cilantro-lime-rice/";
            },},{id: "recipes-cornish-hen-with-homemade-classic-stuffing",
          title: 'Cornish Hen with Homemade Classic Stuffing',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/cornish-hen-stuffing/";
            },},{id: "recipes-creamy-spicy-tomato-beans-and-greens",
          title: 'Creamy, Spicy Tomato Beans and Greens',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/creamy-spicy-tomato-beans-greens/";
            },},{id: "recipes-everything-salmon-with-creamy-caper-sauce",
          title: 'Everything Salmon with Creamy Caper Sauce',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/everything-salmon-caper-sauce/";
            },},{id: "recipes-how-to-cook-filet-mignon",
          title: 'How to Cook Filet Mignon',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/filet-mignon/";
            },},{id: "recipes-fluffy-stovetop-rice",
          title: 'Fluffy Stovetop Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/fluffy-stovetop-rice/";
            },},{id: "recipes-garlic-roasted-chicken-with-vegetables",
          title: 'Garlic Roasted Chicken with Vegetables',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/garlic-roasted-chicken-vegetables/";
            },},{id: "recipes-greek-lemon-potatoes",
          title: 'Greek Lemon Potatoes',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/greek-lemon-potatoes-nyt/";
            },},{id: "recipes-grilled-chicken-marinade",
          title: 'Grilled Chicken Marinade',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/grilled-chicken-marinade/";
            },},{id: "recipes-instant-pot-beef-stew",
          title: 'Instant Pot Beef Stew',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-beef-stew/";
            },},{id: "recipes-instant-pot-chicken-and-rice",
          title: 'Instant Pot Chicken and Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-chicken-and-rice-natashaskitchen/";
            },},{id: "recipes-instant-pot-chicken-thighs",
          title: 'Instant Pot Chicken Thighs',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-chicken-thighs/";
            },},{id: "recipes-instant-pot-honey-garlic-chicken-and-rice",
          title: 'Instant Pot Honey Garlic Chicken and Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-honey-garlic-chicken-rice/";
            },},{id: "recipes-instant-pot-korean-style-beef",
          title: 'Instant Pot Korean-Style Beef',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-korean-style-beef/";
            },},{id: "recipes-instant-pot-lemon-chicken-and-rice",
          title: 'Instant Pot Lemon Chicken and Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-lemon-chicken-rice/";
            },},{id: "recipes-instant-pot-mexican-rice",
          title: 'Instant Pot Mexican Rice',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-mexican-rice/";
            },},{id: "recipes-instant-pot-pot-roast-and-potatoes",
          title: 'Instant Pot Pot Roast and Potatoes',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/instant-pot-pot-roast-potatoes/";
            },},{id: "recipes-lemon-garlic-linguine",
          title: 'Lemon-Garlic Linguine',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/lemon-garlic-linguine/";
            },},{id: "recipes-lentil-tomato-soup",
          title: 'Lentil Tomato Soup',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/lentil-tomato-soup/";
            },},{id: "recipes-microwave-chocolate-pudding-cake",
          title: 'Microwave Chocolate Pudding Cake',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/microwave-chocolate-pudding-cake/";
            },},{id: "recipes-mint-chocolate-cake-grasshopper-cake",
          title: 'Mint Chocolate Cake (Grasshopper Cake)',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/mint-chocolate-cake/";
            },},{id: "recipes-mississippi-chicken",
          title: 'Mississippi Chicken',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/mississippi-chicken/";
            },},{id: "recipes-old-fashioned-beef-stew",
          title: 'Old-Fashioned Beef Stew',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/old-fashioned-beef-stew/";
            },},{id: "recipes-olive-garden-chicken-scampi-pasta",
          title: 'Olive Garden Chicken Scampi Pasta',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/olive-garden-chicken-scampi-pasta/";
            },},{id: "recipes-one-pot-chicken-meatballs-with-greens",
          title: 'One-Pot Chicken Meatballs with Greens',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/one-pot-chicken-meatballs-greens/";
            },},{id: "recipes-one-pot-chicken-and-rice-with-caramelized-lemon",
          title: 'One-Pot Chicken and Rice with Caramelized Lemon',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/one-pot-chicken-rice-caramelized-lemon/";
            },},{id: "recipes-one-pot-tortellini-with-prosciutto-and-peas",
          title: 'One-Pot Tortellini with Prosciutto and Peas',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/one-pot-tortellini-prosciutto-peas/";
            },},{id: "recipes-paprika-chicken-and-potatoes",
          title: 'Paprika Chicken and Potatoes',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/paprika-chicken-potatoes/";
            },},{id: "recipes-parmesan-crusted-chicken",
          title: 'Parmesan-Crusted Chicken',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/parmesan-crusted-chicken/";
            },},{id: "recipes-peanut-butter-noodles",
          title: 'Peanut Butter Noodles',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/peanut-butter-noodles/";
            },},{id: "recipes-pesto-beans",
          title: 'Pesto Beans',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/pesto-beans/";
            },},{id: "recipes-roasted-chicken-thighs-with-hot-honey-and-lime",
          title: 'Roasted Chicken Thighs with Hot Honey and Lime',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/roasted-chicken-thighs-hot-honey-lime/";
            },},{id: "recipes-sausage-broccoli-rigatoni",
          title: 'Sausage Broccoli Rigatoni',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/sausage-broccoli-rigatoni/";
            },},{id: "recipes-sausage-with-peppers-and-onions",
          title: 'Sausage with Peppers and Onions',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/sausage-peppers-onions/";
            },},{id: "recipes-scalloped-potatoes-and-ham",
          title: 'Scalloped Potatoes and Ham',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/scalloped-potatoes-ham/";
            },},{id: "recipes-classic-shepherd-39-s-pie",
          title: 'Classic Shepherd&amp;#39;s Pie',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/shepherds-pie/";
            },},{id: "recipes-smash-burger",
          title: 'Smash Burger',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/smash-burger/";
            },},{id: "recipes-sour-cream-noodle-bake",
          title: 'Sour Cream Noodle Bake',
          description: "",
          section: "Recipes",handler: () => {
              window.location.href = "/recipebook/sour-cream-noodle-bake/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
