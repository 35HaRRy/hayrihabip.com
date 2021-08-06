import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { BlogPost } from './blogPost';

import { BlogListService } from '../blog-list/blog-list.service';

import { APIResult } from '../../tools/request/APIResult';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  providers: [
    BlogListService
  ],
  styleUrls: [
    './blog-post.component.scss'
  ]
})

export class BlogPostComponent implements OnInit {
  blogPosts$?: Observable<APIResult<BlogPost>>;
  id!: string;

  // post!: BlogPost;
  post: BlogPost = {
    id: 1,
    title: 'Why Every Developer Should Have A Blog',
    intro: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies...',
    info: {
      publishDate: '2 days ago',
      readMin: '5 min',
      commentCount: 8
    },
    navigator: {
    },
    body: [
      {
        component: "figure",
        attributes: {
          className: "blog-banner"
        },
        children: [
          {
            component: "a",
            attributes: {
              href: "https://made4dev.com"
            },
            children: [
              {
                component: "img",
                attributes: {
                  className: "img-fluid",
                  src: "assets/images/blog/blog-post-banner.jpg",
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
              "Image Credit:",
              {
                component: "a",
                attributes: {
                  href: "https://made4dev.com?ref=devblog",
                  target: "_blank"
                }
              },
            ]
          }
        ]
      },
      {
        component: "p",
        children: [
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim"
        ]
      },
      {
        component: "h3",
        attributes: {
          className: "mt-5 mb-3"
        },
        children: [
          "Code Block Example"
        ]
      },
      {
        component: "p",
        children: [
          "You can get more info at",
          {
            component: "a",
            attributes: {
              href: "https://highlightjs.org/",
              target: "_blank"
            },
            children: [
              "You can get more info at",
            ]
          },
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim."
        ]
      },
      {
        component: "code",
        children: [
          `function $initHighlight(block, cls) {
            try {
              if (cls.search(/\\bno\\-highlight\\b/) != -1)
                return process(block, true, 0x0F);
            } catch (e) {
              /* handle exception */
            }

            for (var i = 0 / 2; i < classes.length; i++) {
              if (checkCondition(classes[i]) === undefined)
                console.log('undefined');
            }
          }

          export  $initHighlight;`
        ]
      },
      {
        component: "h3",
        attributes: {
          className: "mt-5 mb-3"
        },
        children: [
          "Typography"
        ]
      },
      {
        component: "p",
        children: [
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus"
        ]
      },
      {
        component: "h5",
        attributes: {
          className: "my-3"
        },
        children: [
          "Bullet Points:"
        ]
      },
      {
        component: "ul",
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
              "Lorem ipsum dolor sit amet consectetuer."
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              " Aenean commodo ligula eget dolor."
            ]
          },
        ]
      },
      {
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
              "Lorem ipsum dolor sit amet consectetuer."
            ]
          },
          {
            component: "li",
            attributes: {
              className: "mb-2"
            },
            children: [
              " Aenean commodo ligula eget dolor."
            ]
          },
        ]
      },
      {
        component: "h5",
        attributes: {
          className: "my-3"
        },
        children: [
          "Quote Example:"
        ]
      },
      {
        component: "blockquote",
        attributes: {
          className: "blockquote m-lg-5 py-3 pl-4 px-lg-5"
        },
        children: [
          {
            component: "p",
            attributes: {
              className: "mb-2"
            },
            children: [
              "You might not think that programmers are artists, but programming is an extremely creative profession. It's logic-based creativity."
            ]
          },
          {
            component: "footer",
            attributes: {
              className: "blockquote-footer"
            },
            children: [
              "John Romero"
            ]
          },
        ]
      },
      {
        component: "h5",
        attributes: {
          className: "my-3"
        },
        children: [
          "Table Example:"
        ]
      },
      {
        component: "table",
        attributes: {
          className: "table table-striped my-5",
          rows: [
            {
              First: "Mark",
              Last: "Otto",
              Handle: "@mdo"
            },
            {
              First: "Jacob",
              Last: "Thornton",
              Handle: "@fat"
            }
          ]
        }
      },
      {
        component: "h5",
        attributes: {
          className: "my-3"
        },
        children: [
          "Embed A Tweet:"
        ]
      },
      {
        component: "tweet",
        attributes: {
          tweetId: "926458505355235328"
        }
      },
      {
        component: "h3",
        attributes: {
          className: "mt-5 mb-3"
        },
        children: [
          "Video Example"
        ]
      },
      {
        component: "p",
        children: [
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."
        ]
      },
      {
        component: "div",
        attributes: {
          className: "embed-responsive embed-responsive-16by9"
        },
        children: [
          {
            component: "video",
            attributes: {
              src: "https://www.youtube.com/embed/hnCmSXCZEpU"
            }
          },
        ]
      },
    ]
  };

  constructor(private activatedRoute: ActivatedRoute, private blogListService: BlogListService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"] ?? "0"; // todo: son eklenen post' un id' si
      this.blogListService
        .getById(Number(this.id))
        .subscribe(response => {
          if (response.MessageType != 0)
            this.post = response.Result!;
        });
    });
  }
}
