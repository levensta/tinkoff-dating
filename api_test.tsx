// import React, {useEffect} from "react";
// import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
// import {storage} from "./src/firebase";
// import {v4 as uuidv4} from "uuid";
//

// get all
// getDocs(collection(db, "users"))
//   .then(r => {
//     console.log('--------')
//     r.forEach((doc) => {
//       console.log(`${doc.id} => ${doc.data()}`);
//     });
//   });

// get single
// const docRef = doc(db, "users", "guQWD918bhUiDmHdVbdnNUyVZuD3");
// getDoc(docRef).then(r => {
//   if (r.exists()) {
//     console.log(r.data());
//   }
// });

// get multiple with querry
// where, orderBy, limit
// const q = query(collection(db, "users"), where("description", "==", "lol"));
// getDocs(q).then(r => {
//     console.log('--------')
//     r.forEach((doc) => {
//       console.log(`${doc.id} => ${doc.data()}`);
//     });
//   });

// upd
// const ref = doc(db, "users", "guQWD918bhUiDmHdVbdnNUyVZuD3");
// // updateDoc(ref, {
// //   description: 'lol'
// // }).then(r => console.log(r));

// useEffect(() => {
//   if (image) {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result as string);
//     };
//     reader.readAsDataURL(image);
//   } else {
//     setPreview('');
//   }
// }, [image]);
//
// const handleLoadFile = (e: any) => {
//   const file = e.target.files[0];
//   if (file && file.type.slice(0, 5) === 'image') {
//     setImage(file);
//   } else {
//     setImage(null);
//   }
// };
//
//
// const refStorage = ref(storage, `images/${uuidv4()}-${image?.name}`);
// uploadBytesResumable(refStorage, image!);
// const imgURL = await getDownloadURL(refStorage);
//
//
// <input
//   {...register('photo', {
//     required: true,
//   })}
//   type="file"
//   accept="image/*"
//   onChange={handleLoadFile}
//   className={"block mb-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"}
// />
