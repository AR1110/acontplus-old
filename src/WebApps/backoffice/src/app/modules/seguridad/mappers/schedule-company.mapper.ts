function scheduleCompanyMapper(companyId: number, data: any[]): any[] {
  const emptyList: any[] = [];

  data.forEach((item) => {
    let scheduleCompany: any = {
      id: item.id ?? 0,
      scheduleId: item.scheduleId,
      companyId: companyId,
      startTime: item.startTime ?? '',
      endTime: item.endTime ?? '',
      isActive: item.isActive ?? true,
    };
    emptyList.push(scheduleCompany);
  });
  return emptyList;
}

function compareResponseToMapper(
  schedule: any[],
  schedulesCompany: any[],
): any[] {
  const emptyList: any[] = [];
  schedule.forEach((item) => {
    let scheduleCompanyItem = schedulesCompany.find(
      (x) => x.scheduleId == item.scheduleId,
    );
    let scheduleCompany: any = {
      id: scheduleCompanyItem?.id ?? 0,
      scheduleId: scheduleCompanyItem?.scheduleId ?? 0,
      companyId: scheduleCompanyItem?.companyId ?? 0,
      day: item.day,
      startTime: scheduleCompanyItem?.startTime ?? '',
      endTime: scheduleCompanyItem?.endTime ?? '',
      isActive: scheduleCompanyItem?.isActive ?? true,
    };
    emptyList.push(scheduleCompany);
  });
  return emptyList;
}

export { scheduleCompanyMapper, compareResponseToMapper };
