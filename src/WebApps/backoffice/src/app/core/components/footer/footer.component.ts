import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styles: `
    footer {
        flex-shrink: 0;
        padding: 1rem;
        text-align: center;
        background-color: var(--background-color);
        color: var(--text-primary);
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        width: 100%;
        z-index: 1000;
      bottom: 0;
    }
    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .copyright {
      color: #666;
      font-size: 0.9rem;
    }
    .company-link {
      color: var(--pink);
      text-decoration: none;
      margin-left: 0.5rem;
    }

    .social-links {
      list-style: none;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      flex-wrap: wrap; /* Allow wrapping on smaller screens */
      justify-content: flex-end; /* right align social links */
    }

    .social-links li {
      margin-left: 1rem;
    }

    .social-icon {
      font-size: 1.5rem;
      text-decoration: none;
    }

    .whatsapp {
      color: #25d366; /* WhatsApp green */
    }

    .youtube {
      color: #ff0000; /* YouTube red */
    }

    .facebook {
      color: #1877f2; /* Facebook blue */
    }

    .google-play {
      color: #4caf50; /* Google Play green */
    }

    .privacy-link {
      text-decoration: none;
      color: #9e9e9e; /* Grey from material design */
      font-size: 0.875rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .social-links {
        margin-top: 1rem;
        justify-content: center; /* Center social links on smaller screens */
      }

      .social-links li {
        margin-left: 0.5rem;
      }
    }

    @media (max-width: 599px) {
      .footer-container {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
})
export class FooterComponent {}
