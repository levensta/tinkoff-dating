export interface IAuthFormFields {
  email: string,
  pass: string
}

export interface IRegisterFormFields extends IAuthFormFields {
  name: string,
  photo: string,
}

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

export interface Chat {
  avatarURL?: string,
  chatId: string,
  name: string,
  lastMessage: string
}

export interface Message {
  id: string,
  senderId: string,
  text: string,
}
