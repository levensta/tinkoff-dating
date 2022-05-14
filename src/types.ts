export interface IAuthFormFields {
  email: string,
  pass: string
}

export interface IRegisterFormFields extends IAuthFormFields{
  name: string,
  photo: string,
}
