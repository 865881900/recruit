import moment from "moment";
import {modelT} from "@/utils/js/utils";

export function isNNN(v) {
  return [null, undefined, ''].includes(v)
}


export function requiredCheckFun(obj, requiredCheckList) {
  let item;
  for (let i = 0; i < requiredCheckList.length; i++) {
    item = requiredCheckList[i];
    if (item.required === false) {
      continue
    }
    if (isNNN(obj[item.key])) {
      let title;
      switch (item.type) {
        case 'input':
        case 'textarea':
          title = '请输入' + item.title
          break
        case 'picker':
        case 'image':
        case 'date':
          title = '请选择' + item.title
          break
      }
      modelT(title);
      return false
    } else if (item.validator) {
      const m = item.validator(obj[item.key])
      if (m) {
        modelT(m);
        return false;
      }
    }
  }
  return true;
}


//
export function genDate(date) {
  return moment(date).format('yyyy-MM-DD')
}


export function getLabelByEquals(optionList = [], equals = () => {
}) {
  const optionItem = optionList.find((item) => equals(item));
  return optionItem ? (optionItem.value || optionItem.title) : "--";
}

