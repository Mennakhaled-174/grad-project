export enum userRole {
  ADMIN  = 'admin',
  USER   = 'user',
  WORKER = 'worker',
}

export enum otpEnum {
  changePassword = 'changePassword',
}

export enum tokenEnum {
  accessToken  = 'accessToken',
  refreshToken = 'refreshToken',
}

export enum cityEnum {
  Cairo = 'Cairo',
  Giza  = 'Giza',
}

export enum serviceTypeEnum {
  StandardCarePackage = 'Standard Care Package',
  DeepCarePackage     = 'Deep Care Package',
  MoveInPackage       = 'Move In Package',
}

export enum sizeTypeEnum {
  Size80To120  = '80-120',
  Size121To200 = '121-200',
  Size201To250 = '201-250',
  Size251To300 = '251-300',
}

export enum paymentMethodEnum {
  CASH   = 'Cash',
  CREDIT = 'Credit',
}

export enum documentEnum {
  VERIFIED   = 'verified',
  UNVERIFIED = 'unverified',
}

export enum availabilityEnum {
  AVAILABLE   = 'available',
  UNAVAILABLE = 'unavailable',
  BUSY        = 'busy',
}

export enum BookingStatus {
  PENDING    = 'pending',
  ASSIGNED   = 'assigned',
  ACCEPTED   = 'accepted',
  ON_THE_WAY = 'on_the_way',
  COMPLETED  = 'completed',
  REJECTED   = 'rejected',
  CANCELLED  = 'cancelled',
}



export enum promoCodeEnum {
  SAVE10  = 'SAVE10',
  SAVE20  = 'SAVE20',
  SAVE30  = 'SAVE30',
}

export const promoDiscounts: Record<promoCodeEnum, number> = {
  [promoCodeEnum.SAVE10]: 10,
  [promoCodeEnum.SAVE20]: 20,
  [promoCodeEnum.SAVE30]: 30,
};