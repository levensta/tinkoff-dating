export interface IAuthFormFields {
  email: string,
  pass: string
}

export interface IRegisterFormFields extends IAuthFormFields{
  name: string,
  photo: string,
}

// ({email, pass, name, photo}: { email: any; pass: any; name: any; photo: any }, e?: Event) => void


export interface Profile {
  id: string,
  avatarURL?: string,
  name: string,
  age?: number,
  city?: string,
  description?: string,
  photosURLs :Array<string>
  tagsInterests: Array<string>,
  _likedProfiles: Array<string>,
  _watchedProfiles: Array<string>,
  isHiddenProfile?: boolean,
  isHiddenAge?: boolean,
}
