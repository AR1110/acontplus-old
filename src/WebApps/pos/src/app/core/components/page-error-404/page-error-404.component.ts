import { Component } from '@angular/core';

@Component({
    selector: 'app-page-error-404',
    imports: [],
    template: ` <section id="wrapper" class="error-page">
  <div class="error-box">
      <div class="error-body text-center">
          <h1>404</h1>
          <h3 class="text-uppercase">Page Not Found !</h3>
          <p class="text-muted m-t-30 m-b-30">YOU SEEM TO BE TRYING TO FIND HIS WAY HOME</p>
          <a href="" class="btn btn-info btn-rounded waves-effect waves-light m-b-40 text-white">Back to home</a> </div>

  </div>
</section>
`,
    styles: `.error-box {
    height: 100%;
    position: fixed;
    background: url(/assets/images/background/error-bg.jpg) no-repeat center center #fff;
    width: 100%; }
    .error-box .footer {
      width: 100%;
      left: 0px;
      right: 0px; }

  .error-body {
    padding-top: 5%; }
    .error-body h1 {
      font-size: 210px;
      font-weight: 900;
      text-shadow: 4px 4px 0 #fff, 6px 6px 0 #343a40;
      line-height: 210px; }
  `
})
export class PageError404Component {

}
