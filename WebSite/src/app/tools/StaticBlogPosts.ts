import { BlogPost } from '../pages/blog-post/blogPost';

export const StaticBlogPosts: BlogPost[] = [
  {
    id: "611826c7514f7965643bae8a",
    title: "Facebook ve Instagram paylaşımlarını alma",
    intro: "Verilen access token' a göre kullanıcıya ait tüm facebook veya instagram gönderilerini alın.",
    info: {
      regDate: new Date(2021, 7, 14, 23, 26),
      readMin: "2 min",
      commentCount: 0
    },
    navigator: {
      nextPostId: "611ecd38ebbdf60b35d225da"
    },
    imageName: "fb-instagram.png",
    body: [
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "figure",
        attributes: {
          className: "blog-banner"
        },
        children: [
          {
            component: "img",
            attributes: {
              className: "img-fluid",
              src: "assets/images/blog/fb-instagram.png",
              alt: "image"
            },
          }
        ],
        sortIndex: 1
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "p",
        children: [
          "Kişisel bir istekten dolayı Instagram' da ve Facebook' ta bir kullancıya ait tüm paylaşımları toplamam gerekiyordu. Tabiki bir yazılımcı bunu ilgili api' lere bağlanan bir uygulama ile yapardı. Bunun için şöyle",
          {
            component: "strong",
            children: [
              {
                component: "a",
                attributes: {
                  target: "_blank",
                  href: "https://github.com/35HaRRy/FBInstagramAPI"
                },
                children: [
                  "çok ufacık bir uygulama"
                ]
              }
            ]
          },
          " hazırladım.",
          "Bu uygulamaya istekte bulunulacak api' yi belirtikten sonra ",
          {
            component: "strong",
            children: [
              "\"access token\""
            ]
          },
          " değerini vererek çalışıyor. Tabi Instagram için \"user id\" ye de ihtiyacınız var. Ondan daha sonra bahsedeceğim. Bu değerleri girdikten sonra da uygulama api' ye kuyruk şeklinde isteklerde bulunarak kişiye ait tüm paylaşımları çekmeye başlıyor."
        ],
        sortIndex: 2
      },
      {
        blogPostId: "611826c7514f7965643bae8a",
        component: "h1",
        attributes: {
          className: "mt-4 mb-3"
        },
        children: [
          "Facebook API"
        ],
        sortIndex: 3
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "p",
        children: [
          "Hala bazı api' lerin dokümanlarını (biraz sonra bahsedeceğim Instagram' ınki gibi) okumak zor oluyor. Neyseki Facebook' unki böyle değil çünkü ",
          {
            component: "strong",
            children: [
              {
                component: "a",
                attributes: {
                  target: "_blank",
                  href: "https://developers.facebook.com/tools/explorer/"
                },
                children: [
                  "Graph API Explorer"
                ]
              }
            ]
          },
          "aracı var. Kurcalamak istediğim paylaşımları bu araç ile deneyebildim.",
          "Bu araç ile yaptıklarımı tek bir görsel ile adım adım anlatayım."
        ],
        sortIndex: 4
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "figure",
        children: [
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://developers.facebook.com/tools/explorer/?method=GET&path=me%2Fposts%3Ffields%3Dmessage%2Cpermalink_url&version=v11.0"
            },
            children: [
              {
                component: "img",
                attributes: {
                  className: "img-fluid",
                  src: "assets/images/blog/fb-posts.png",
                  alt: "image"
                },
              }
            ]
          },
          {
            component: "figcaption",
            attributes: {
              className: "mt-2 text-center image-caption",
            },
            children: [
              "Facebook Graph API Explorer post' lar"
            ]
          }
        ],
        sortIndex: 5
      },
      {
        blogPostId: "611826c7514f7965643bae8a",
        component: "ol",
        attributes: {
          className: "mb-5"
        },
        children: [
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "İlk olarak kullanıcının post' larını alacağımız için izinlerden ",
              {
                component: "strong",
                children: [
                  "\"user_posts\""
                ]
              },
              "u seçmemiz gerekiyor."
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Bundan sonra ",
              {
                component: "strong",
                children: [
                  "\"Generate Acces Token\""
                ]
              },
              " diyerek istediğimiz kullanıcı ile giriş yapabiliriz. Böylece bu kullanıcıya ait \"access token\" ı oluşacaktır. Bu \"access token\" daha sonra uygulamada kullanacağız."
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Ardından post' ları almak için kullanacağımız linki girebiliriz. Burada endpoint' imizin tamamı ",
              {
                component: "strong",
                children: [
                  "\"me/posts?fields=message,permalink_url\""
                ]
              },
              " oluyor. ",
              {
                component: "strong",
                children: [
                  "\"fields\"",
                  " query-string' i ile post' ların message ve link bilgilerini almak istediğimizi beliriyoruz."
                ]
              },
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Tabiki son olarak da ",
              {
                component: "strong",
                children: [
                  "\"Submit\""
                ]
              },
              " butonu ile istekte bulunuyoruz."
            ]
          }
        ],
        sortIndex: 6
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "p",
        children: [
          "Console uygulmamda bu çıktıyı işleyecek döngünün içerisinde şöyle minik bir şablonum var.",
        ],
        sortIndex: 7
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "code",
        attributes: {
          languages: [
            "C#"
          ]
        },
        children: [
          `media.data
            .Where(item => !string.IsNullOrEmpty(item.message))
            .Select(item => $"id: {item.id}\\nurl: {item.permalink_url}\\n\\t{item.message}");`
        ],
        sortIndex: 8
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "li",
        children: [
          "Burada api' den gelen dönüşün yapısından bahsedeyim. Yapı iki api için de kabaca aynı. ",
          {
            component: "strong",
            children: [
              "\"data\""
            ]
          },
          " ve ",
          {
            component: "strong",
            children: [
              "\"paging\""
            ]
          },
          " özelliklerinden oluşuyor. \"data\" da bir obje array' i ile post' lar oluyor. \"paging\" de de önceki veya sonraki liste için linkler oluyor. Ben sonraki liste için ",
          {
            component: "strong",
            children: [
              "\"paging.next\""
            ]
          },
          " değerini kullandım. Bu değer ile \"GET\" isteğinde bulunarak bir stack yapısında olduğu gibi sıradaki listenin değerlerini alabiliyorsunuz."
        ],
        sortIndex: 9
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "h1",
        attributes: {
          className: "mt-4 mb-3"
        },
        children: [
          "Instagram API"
        ],
        sortIndex: 10
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "p",
        children: [
          "Buradaki işlem birkaç adımdan oluşuyor. Bu adımları ",
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
            },
            children: [
              "Facebook dokümanından"
            ]
          },
          " takip edebilirsiniz. Ben bu uygulamayı tek seferlik kullacağım için ",
          {
            component: "strong",
            children: [
              "\"Valid OAuth Redirect URIs\""
            ]
          },
          " ile bahsedilen adresi ",
          {
            component: "strong",
            children: [
              "\"http://localhost/test\""
            ]
          },
          " olarak tanımladım. Amacım sadece 4. adımdaki gibi test kullanıcısına ait ",
          {
            component: "strong",
            children: [
              "code' u"
            ]
          },
          " alabilmek.",
          "5. adımı da gerçekleştirdikten sonra ",
          {
            component: "strong",
            children: [
              "\"access_token\""
            ]
          },
          " değerlerini uygulamaya göndermek üzere not alabiliriz."
        ],
        sortIndex: 11
      },
      {
        id: "",
        blogPostId: "611826c7514f7965643bae8a",
        component: "figure",
        children: [
          {
            component: "img",
            attributes: {
              className: "img-fluid",
              src: "assets/images/blog/instagram-post.png",
              alt: "image"
            },
          },
          {
            component: "figcaption",
            attributes: {
              className: "mt-2 text-center image-caption",
            },
            children: [
              "Örnek bir uygulama çıktısı"
            ]
          }
        ],
        sortIndex: 12
      }
    ]
  },
  {
    id: "611ecd38ebbdf60b35d225da",
    title: "Angular, AWS, AKS kattım. Sana kek yaptım.",
    intro: "Bir süredir hem bir blog sitesi yapmak hem de Angular, AWS Lambda & serverless ve Azure AKS gibi teknolojileri denemek istiyordum. Bu teknolojileri denerken de blog' umun ilk yazı serisinin konusu çıkmış oldu.",
    info: {
      regDate: new Date(2021, 7, 19, 23, 26),
      readMin: "5 min",
      commentCount: 0
    },
    navigator: {
      previousPostId: "611826c7514f7965643bae8a"
    },
    imageName: "createBlogSeries-1.jpg",
    body: [
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "figure",
        attributes: {
          className: "blog-banner"
        },
        children: [
          {
            component: "img",
            attributes: {
              className: "img-fluid",
              src: "assets/images/blog/createBlogSeries-1.jpg",
              alt: "image"
            },
          }
        ],
        sortIndex: 1
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Bir süredir hem bir blog sitesi yapmak hem de Angular, AWS Lambda & serverless ve Azure AKS gibi teknolojileri denemek istiyordum. Bu teknolojileri denerken de blog' umun ilk yazı serisinin konusu çıkmış oldu. Bu seriye de şu dört başlık ile devam edeceğim."
        ],
        sortIndex: 2
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "ol",
        attributes: {
          className: "mb-5"
        },
        children: [
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              {
                component: "strong",
                children: [
                  "WebSite - 1: Şablon & Angular Kurulum & Component' lerin oluşturulması"
                ]
              }
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              // {
              //   component: "a",
              //   attributes: {
              //     routerLink: "/blog-post/#blogPostId2#"
              //   },
              //   children: [
                  "WebSite - 2: API Bağlantısı & AWS Lambda ile Yayına Alma"
              //   ]
              // }
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              // {
              //   component: "a",
              //   attributes: {
              //     routerLink: "/blog-post/#blogPostId3#"
              //   },
              //   children: [
                  "Azure AKS ile .Net Core API"
              //   ]
              // }
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              // {
              //   component: "a",
              //   attributes: {
              //     routerLink: "/blog-post/#blogPostId4#"
              //   },
              //   children: [
                  "Veri tabanı & MongoDB Atlas"
              //   ]
              // }
            ]
          }
        ],
        sortIndex: 3
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Yazıya başlamadam önce bu uygulamının tüm kodlarına ",
          {
            component: "a",
            attributes: {
              href: "https://github.com/35HaRRy/hayrihabip.com",
              target: "_blank"
            },
            children: [
              {
                component: "icon",
                attributes: {
                  className: "fa-fw",
                  icon: [
                    "fab",
                    "github"
                  ]
                }
              },
              " 35HaRRy/hayrihabip.com"
            ]
          },
          " repository' sinden erişebilirsiniz."
        ],
        sortIndex: 4
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h1",
        attributes: {
          className: "mt-4 mb-3"
        },
        children: [
          "Şablon"
        ],
        sortIndex: 5
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          {
            component: "a",
            attributes: {
              href: "https://www.free-css.com/free-css-templates/page255/devblog-v1.1",
              target: "_blank"
            },
            children: [
              "Bu şablonu"
            ]
          },
          " projeye dahil ettim. Asıl halini bozmamak için ",
          {
            component: "strong",
            children: [
              "\"DevBlog Theme Parsed\""
            ]
          },
          " klasörü altında bir kopyasını oluşturdum. Kopya altındaki html içeriğini de kendi bilgilerime ve ihtiyacıma göre güncelledim."
        ],
        sortIndex: 6
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h1",
        attributes: {
          className: "mt-4 mb-3"
        },
        children: [
          "Angular Kurulum"
        ],
        sortIndex: 7
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          {
            component: "a",
            attributes: {
              href: "https://medium.com/cactus-techblog/deploy-angular-universal-on-aws-lambda-from-scratch-1b169289eac2",
              target: "_blank"
            },
            children: [
              {
                component: "strong",
                children: [
                  "\"Setup Angular Universal on AWS Lambda from scratch\""
                ]
              }
            ]
          },
          " yazısı ile ilk Angular projemin kurulumuna başladım."
        ],
        sortIndex: 8
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "figure",
        children: [
          {
            component: "a",
            attributes: {
              href: "https://medium.com/cactus-techblog/deploy-angular-universal-on-aws-lambda-from-scratch-1b169289eac2",
              target: "_blank"
            },
            children: [
              {
                component: "img",
                attributes: {
                  className: "img-fluid",
                  src: "assets/images/blog/Angular&SSR&AWS.jpeg",
                  alt: "image"
                },
              }
            ]
          },
          {
            component: "figcaption",
            attributes: {
              className: "mt-2 text-center image-caption",
            },
            children: [
              "\"Setup Angular Universal on AWS Lambda from scratch\""
            ]
          }
        ],
        sortIndex: 9
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Bu yazıdaki adımları takip ederek veya ",
          {
            component: "a",
            attributes: {
              href: "https://github.com/sahilpurav/ngx-serverless-starter",
              target: "_blank"
            },
            children: [
              "ngx-serverless-starter"
            ]
          },
          " projesini alarak geliştirmeye hemen başlayabilirsiniz. Bu yazıda ",
          {
            component: "strong",
            children: [
              "Angular 12"
            ]
          },
          " ile çalışan server-side-rendering ",
          {
            component: "strong",
            children: [
              "SSR"
            ]
          },
          " özelliğine sahip uygulamının nasıl oluşturulacağını anlatıyor. Yazının devamında bahsettiği \"Configure Angular Universal to support Lambda\" başlığını ",
          // {
          //   component: "a",
          //   attributes: {
          //     routerLink: "/blog-post/#blogPostId2#"
          //   },
          //   children: [
              "\"WebSite - 2: API Bağlantısı & AWS Lambda ile Yayına Alma\"",
          //   ]
          // },
          " yazımda detaylandıracağım."
        ],
        sortIndex: 10
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h1",
        attributes: {
          className: "mt-4 mb-3"
        },
        children: [
          "Component' lerin oluşturulması"
        ],
        sortIndex: 11
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Gelelim bu yazının odak noktasına. Burada kabaca şunu yaptım. Sayfaları ve sayfalarda ayrı fonksiyonları olan veya tekrar eden html' leri component' lere çevirdim. İlk olarak şablondaki \"index.html\" i parçalamaya başladım. "
        ],
        sortIndex: 12
      },
      {
        component: "h3",
        attributes: {
          className: "mt-4"
        },
        children: [
          "Header - Sol Menü"
        ],
        sortIndex: 13
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          {
            component: "a",
            attributes: {
              href: "https://angular.io/start",
              target: "_blank"
            },
            children: [
              "\"Getting started with Angular\""
            ]
          },
          " sayfası ile Angular geliştirmeye giriş yaptıktan sonra ",
          {
            component: "a",
            attributes: {
              href: "https://angular.io/guide/component-overview#creating-a-component",
              target: "_blank"
            },
            children: [
              "\"Creating a component\""
            ]
          },
          " sayfası ile de component oluşturmayı öğrenerek ilk component' im ",
          {
            component: "a",
            attributes: {
              "target": "_blank",
              "href": "https://github.com/35HaRRy/hayrihabip.com/tree/main/WebSite/src/app/components/header"
            },
            children: [
              "\"Header\" ı",
            ]
          },
          " oluşturdum."
        ],
        sortIndex: 14
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          {
            component: "a",
            attributes: {
              href: "https://angular.io/guide/router",
              target: "_blank"
            },
            children: [
              "\"Angular router\""
            ]
          },
          ", ",
          {
            component: "a",
            attributes: {
              href: "https://www.angularjswiki.com/angular/how-to-get-current-route-in-angular/",
              target: "_blank"
            },
            children: [
              "\"Current Route\""
            ]
          },
          " ve ",
          {
            component: "a",
            attributes: {
              href: "https://stackoverflow.com/questions/33520043/how-to-detect-a-route-change-in-angular/38080657#38080657",
              target: "_blank"
            },
            children: [
              "\"Navigation End\""
            ]
          },
          " yazılarından yönlendirme ile ilgili (bulunulan sayfanın ismi sayfa değiştiğinde geçilen sayfanın ismi gibi) ihtiyacım olan bilgileri aldım. Header component' indeki \"route\" alma şu şekilde "
        ],
        sortIndex: 15
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "TypeScript"
          ]
        },
        children: [
          `export class HeaderComponent implements OnInit {
  currentRoute = '/';

  constructor(private route: Router) {
  }

  ngOnInit(): void {
    this.route.events.forEach(event => {
      if(event instanceof NavigationEnd)
        this.currentRoute = event.url;
    });
  }
}`
        ]
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Tasarımla ilgili olarak koşullu \"class\" kullanımı için aşağıdaki 4 yol epey kullanışlı oldu. 2. yolun benzerini React' da da kullandığım için sol menüde bulunulan sayfayı işaretlemek için bu yolu kullandım."
        ],
        sortIndex: 16
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "figure",
        children: [
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://stackoverflow.com/questions/35269179/angular-conditional-class-with-ngclass/41974490#41974490"
            },
            children: [
              {
                component: "img",
                attributes: {
                  className: "img-fluid",
                  src: "assets/images/blog/AngularConditionalClasses.png",
                  alt: "image"
                },
              }
            ]
          },
          {
            component: "figcaption",
            attributes: {
              className: "mt-2 text-center image-caption",
            },
            children: [
              "Koşullu class kullanmanın 4 yolu"
            ]
          }
        ],
        sortIndex: 17
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Ve olmazsa olmaz muhteşem ",
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://stackoverflow.com/questions/35269179/angular-conditional-class-with-ngclass/41974490#41974490"
            },
            children: [
              {
                component: "strong",
                children: [
                  "FontAwesome."
                ]
              }
            ]
          },
          "Maalesef ",
          {
            component: "strong",
            children: [
              "app.module.ts"
            ]
          },
          "' in içerisinde şöyle pek sevimli olmayan bir tanımlama yapmak gerekiyor."
        ],
        sortIndex: 18
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "TypeScript"
          ]
        },
        children: [
          `import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHome, faUser, faBookmark, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faHome, faUser, faBookmark, faLongArrowAltLeft, faLongArrowAltRight, faTwitter, faGithub, faLinkedin);
  }
}`
        ],
        sortIndex: 19
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Neyseki html şablonun içerisindeki kullanımı daha kolay"
        ],
        sortIndex: 20
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "TypeScript"
          ]
        },
        children: [
          `<fa-icon [icon]="['fab', 'twitter']" class="fa-fw"></fa-icon>`
        ],
        sortIndex: 21
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h3",
        attributes: {
          className: "mt-4"
        },
        children: [
          "BlogList (index) sayfası ve liste elemanları"
        ],
        sortIndex: 22
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Blog listesindeki post kartları için \"blog-list-item\" component' ini oluşturdum. Bu component' lere değer geçmek için kullanılan ",
          {
            component: "strong",
            children: [
              "@Input"
            ]
          },
          " decorator' ını ",
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://angular.io/guide/component-interaction"
            },
            children: [
              "Component interaction"
            ]
          },
          " dokümanı ile keşfetmiş oldum. @Input un yardımıcı ile değer geçtiğim post kartlarını dizmek için ",
          {
            component: "a",
            attributes: {
              target: "_blank",
              href: "https://ultimatecourses.com/blog/angular-ngfor-template-element"
            },
            children: [
              "ngFor"
            ]
          },
          " kullandım. blog-list sayfası da şu hale gelmiş oldu."
        ],
        sortIndex: 23
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "a",
        attributes: {
          target: "_blank",
          href: "https://github.com/35HaRRy/hayrihabip.com/blob/main/WebSite/src/app/pages/blog-list/blog-list.component.html"
        },
        children: [
          {
            component: "code",
            attributes: {
              languages: [
                "html"
              ]
            },
            children: [
              `<section class="blog-list px-3 py-5 p-md-5">
  <div class="container">
    <ng-template ngFor let-post [ngForOf]="posts">
      <app-blog-list-item [data]="post"></app-blog-list-item>
    </ng-template>
    <app-blog-navigator [pager]="pager" [isForList]="true"></app-blog-navigator>
  </div>
</section>
<footer class="footer text-center py-2 theme-bg-dark"></footer>`
            ],
          }
        ],
        sortIndex: 24
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h5",
        attributes: {
          className: "mt-4"
        },
        children: [
          "Navigator"
        ],
        sortIndex: 25
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Blog listesinin ve postların altında kullanmak üzere \"blog-navigator\" component' ini oluşturdum. List ve post ayrımını yapabilmek için ",
          {
            component: "strong",
            children: [
              "\"isForList\""
            ]
          },
          " boolean değerini ve ",
          {
            component: "strong",
            children: [
              "ng-container *ngIf / ng-template"
            ]
          },
          " yapısını kullandım. Örnek yapı şu şekilde"
        ],
        sortIndex: 26
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "html"
          ]
        },
        children: [
          `<ng-container *ngIf="isForList; then list else page"></ng-container>
<ng-template #list>
  Liste
</ng-template>
<ng-template #page>
  Sayfa
</ng-template>`
        ],
        sortIndex: 27
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h3",
        attributes: {
          className: "mt-4"
        },
        children: [
          "Blog Post Sayfası"
        ],
        sortIndex: 28
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Bütün sitede haliyle her şeyin olduğu sayfa burası. Bu sayfayı da şu şekilde böldüm."
        ],
        sortIndex: 29
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "ol",
        attributes: {
          className: "mb-5"
        },
        children: [
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Başlık alanı ve içerisinde \"blog-post-info\" component' i ile ufak bilgilendirme alanı"
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Yazı alanı ve içerisinde \"blog-post-item\" component' i ile yazının bileşenleri"
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              "Son olarak yorumlar alanı ve içerisinde ",
              {
                component: "a",
                attributes: {
                  href: "https://www.npmjs.com/package/ngx-disqus",
                  target: "_blank"
                },
                children: [
                  "\"disqus\""
                ]
              },
              " component' i"
            ]
          }
        ],
        sortIndex: 30
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "h5",
        attributes: {
          className: "mt-4"
        },
        children: [
          "blog-post-item"
        ],
        sortIndex: 31
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Bu component ile ufaktan bir şablon yapısı kurdum. Belki de biraz overengineering oldu. Angular tarafında her biri bir html elemana veya component' e denk gelecek şu yapıda json objeleri oluşturdum."
        ],
        sortIndex: 32
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "TypeScript"
          ]
        },
        children: [
          `interface BlogPostItem {
  id?: string;
  blogPostId?: string;
  component: string;
  attributes?: {
    [key: string]: any;
  };
  children?: (string | BlogPostItem)[];
  sortIndex?: number;
}`
        ],
        sortIndex: 33
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          {
            component: "strong",
            children: [
              "\"component\""
            ]
          },
          "değeri türünü, ",
          {
            component: "strong",
            children: [
              "\"attributes\""
            ]
          },
          "değeri de özelliklerini ve ",
          {
            component: "strong",
            children: [
              "\"children\""
            ]
          },
          " da bu component' in tag' leri içerisine gelecek diğer component' i belirtiyor. JSON değerleri ile component' leri eşlemek için ",
          {
            component: "strong",
            children: [
              "container-element [ngSwitch] / *ngSwitchCase"
            ]
          },
          " yapısını kullandım. Burada eşleşen component' in içerisinde tekrar \"children\" değeri ile tekrar \"blog-post-item\" component' ini çağırarak recursive bir yapı oluşturdum. Kod örneği şu şekilde"
        ],
        sortIndex: 34
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "code",
        attributes: {
          languages: [
            "html"
          ]
        },
        children: [
          `<ng-template ngFor let-item [ngForOf]="data">
  <ng-container *ngIf="typeOf(item) == 'string'; then text else component"></ng-container>
  <ng-template #text>
    {{ item }}
  </ng-template>
  <ng-template #component>
    <container-element [ngSwitch]="$any(item).component">
      <a *ngSwitchCase="'a'" [class]="$any(item).attributes?.className" [href]="$any(item).attributes?.href" [target]="$any(item).attributes?.target">
        <app-blog-post-item [data]="$any(item).children"></app-blog-post-item>
      </a>
      <img *ngSwitchCase="'img'" [class]="$any(item).attributes?.className" [src]="$any(item).attributes?.src" [alt]="$any(item).attributes?.alt">
      <p *ngSwitchCase="'p'" [class]="$any(item).attributes?.className">
        <app-blog-post-item [data]="$any(item).children"></app-blog-post-item>
      </p>
      <h1 *ngSwitchCase="'h1'" [class]="$any(item).attributes?.className">
        <app-blog-post-item [data]="$any(item).children"></app-blog-post-item>
      </h1>
      <div *ngSwitchDefault>
        {{ $any(item).component }}
      </div>
    </container-element>
  </ng-template>
</ng-template>`
        ],
        sortIndex: 35
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Tabi bu component' i oluşturmak için kullandığım 2 tane de yardımcı component kütüphanesi var. İlki paylaştığım kod örneklerini güzelleştiren ",
          {
            component: "strong",
            children: [
              {
                component: "a",
                attributes: {
                  target: "_blank",
                  href: "https://www.npmjs.com/package/ngx-highlightjs"
                },
                children: [
                  "ngx-highlightjs"
                ]
              }
            ]
          },
          " diğeri de tweet paylaşmak için kullanacağım ",
          {
            component: "strong",
            children: [
              {
                component: "a",
                attributes: {
                  target: "_blank",
                  href: "https://www.npmjs.com/package/ngx-tweet"
                },
                children: [
                  "ngx-tweet"
                ]
              }
            ]
          },
          " İkisi de kullanımı güzel component' ler."
        ],
        sortIndex: 36
      },
      {
        blogPostId: "611ecd38ebbdf60b35d225da",
        component: "p",
        children: [
          "Buraya kadar sitenin statik yapısını hazırlamış olduk. Bu yazım burada bitiyor ancak yazı serim devam ediyor. ",
          {
            component: "strong",
            children: [
              "API Bağlantısı & AWS Lambda ile Yayına Alma"
            ]
          },
          " yazımda görüşmek üzere."
        ],
        sortIndex: 37
      }
    ]
  }
];
