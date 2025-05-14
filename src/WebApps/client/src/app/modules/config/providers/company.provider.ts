import {CompanyRepository} from "@modules/config/domain/repositories/company.repository";
import {CompanyRepositoryImpl} from "@modules/config/data/company/company-repository.impl";

export const companyProvider = {
  provide: CompanyRepository,
  useClass: CompanyRepositoryImpl,
};
