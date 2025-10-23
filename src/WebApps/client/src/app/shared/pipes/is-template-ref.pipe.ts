import { Pipe, PipeTransform, TemplateRef } from '@angular/core';

@Pipe({ name: 'isTemplateRef' })
export class AcpIsTemplateRefPipe implements PipeTransform {
  transform(obj: any) {
    return obj instanceof TemplateRef;
  }
}
