import { importProvidersFrom } from "@angular/core";
import { QuillModule } from "ngx-quill";

export const editorConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }], // text direction
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
    ]
  }
};

export const editorProviders = [
  importProvidersFrom(
    QuillModule.forRoot(editorConfig)
  )
];
