import { serviceTypeEnum } from "../Types/types";

export const servicesPrices = {

  [serviceTypeEnum.StandardCarePackage]: {
    "80-120": 378,
    "121-200": 504,
    "201-250": 630,
    "251-300": 756,
  },

  [serviceTypeEnum.DeepCarePackage]: {
    "80-120": 756,
    "121-200": 1134,
    "201-250": 1386,
    "251-300": 1764,
  },

  [serviceTypeEnum.MoveInPackage]: {
    "80-120": 1638,
    "121-200": 2079,
    "201-250": 2394,
    "251-300": 2772,
  },

};