import { DocConfigInfoAdicionalList} from '@modules/config/data/models/doc-config.model';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

export class DocConfigInfoAdicionalesMapper {
  static toJson(id: number) {
    return JSON.stringify({
      tipo: 3,
      id,
    });
  }

  static fromJson(response: any) {
    let infoAdicional: DocConfigInfoAdicionalList[] = [];
    if (response && typeof response === 'object') {
      const [mainData] = response.infoAdicional;
      infoAdicional = JSON.parse(mainData.infoAdicional) || [];
    }

    return infoAdicional.map((item: any, index: number) => {
      return {
        unique: generateUuidv4(),
        ...item,
      };
    });
  }
}
