export const PoliticalStatusEnum = [
  {"id": 1, "key": "CPC_MEMBER", "value": "中共党员"},
  {
    "id": 2,
    "key": "CPC_PREP_MEMBER",
    "value": "中共预备党员"
  }, {"id": 3, "key": "YOUTH_LEAGUE_MEMBER", "value": "共青团员"}, {
    "id": 4,
    "key": "KMT_REV_MEMBER",
    "value": "民革党员"
  }, {"id": 5, "key": "DMA_MEMBER", "value": "民盟盟员"}, {
    "id": 6,
    "key": "DJP_MEMBER",
    "value": "民建会员"
  }, {"id": 7, "key": "DJM_MEMBER", "value": "民进会员"}, {
    "id": 8,
    "key": "NPP_MEMBER",
    "value": "农工党党员"
  }, {"id": 9, "key": "ZGM_MEMBER", "value": "致公党党员"}, {
    "id": 10,
    "key": "JUS_MEMBER",
    "value": "九三学社社员"
  }, {"id": 11, "key": "TAM_MEMBER", "value": "台盟盟员"}, {
    "id": 12,
    "key": "NON_PART_MEMBER",
    "value": "无党派民主人士"
  }, {"id": 13, "key": "MASS", "value": "群众"}];
export const JobSeekerStatusEnum = [
  {"id": 1, "key": "EMPLOYED", "value": "在职"}, {
    "id": 2,
    "key": "RESIGNED",
    "value": "离职"
  }, {"id": 3, "key": "EMPLOYED_INT", "value": "在职-实习"}, {"id": 4, "key": "RESIGNED_INT", "value": "离职-实习"}];
export const EducationRequirementEnum = [
  {"id": 1, "key": "JUNIOR_MIDDLE", "value": "初中"}, {
    "id": 2,
    "key": "SENIOR_SECONDARY",
    "value": "中专"
  }, {"id": 3, "key": "DIPLOMA", "value": "大专"}, {"id": 4, "key": "BACHELOR", "value": "本科"}, {
    "id": 5,
    "key": "MASTER",
    "value": "硕士研究生"
  }, {"id": 6, "key": "DOCTORATE", "value": "博士研究生"}];

function getLabelByEquals(optionList = [], equals = () => {
}) {
  const optionItem = optionList.find((item) => equals(item));
  return optionItem ? (optionItem.value || optionItem.title) : "--";
}
