// TODO: remove this and replace with API client once thats complete, see:
// https://github.com/csesoc/website/pull/238
export const publishDocument = (documentId: string) => {
    fetch("/api/filesystem/publish-document", {
        method: "POST",
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          DocumentID: `${documentId}`,
        }),
    });
}

// upload an image to the docker volume
export const publishImage = (documentId: string, imageSrc: File) => {
  // console.log("publishing image", imageSrc)

  /*
// V2 - Using FormData and passing imageSrc as a `File`

export const publishImage = (documentId: string, imageSrc: File) => {
  const formData = new FormData()

  // passing in placeholder values for now
  formData.append('Parent', `58fe2b96-50c6-4100-802c-a29664aa5c86`);
  formData.append('LogicalName', `placeholder`);
  formData.append('OwnerGroup', `1`);
  formData.append('Image', imageSrc);
}

fetch("/api/filesystem/upload-image", {
  method: "POST",
  body: formData
})
.then(..)
  */

  /*

  // V1 - Passing image as base64 String
export const publishImage = (documentId: string, imageSrc: string) => {
  fetch("/api/filesystem/upload-image", {
    method: "POST",
    headers: {
    //  "Content-Type": "multipart/form-data",
    },
    body: new URLSearchParams({
      Parent: `58fe2b96-50c6-4100-802c-a29664aa5c86`, // (placeholder)
      LogicalName: "placeholder",
      OwnerGroup: '1',
      Image: imageSrc 
    }),
  })
  .then(..)
}
  */
  const formData = new FormData()

  // passing in placeholder values for now
  formData.append('Parent', `58fe2b96-50c6-4100-802c-a29664aa5c86`);
  formData.append('LogicalName', imageSrc.name);
  formData.append('OwnerGroup', `1`);
  formData.append('Image', imageSrc);

  const imageId = 
    fetch("/api/filesystem/upload-image", {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      method: "POST",
      body: formData
    })
    .then(rawData => rawData.json())
    .then(data => {
      if (data.ok) {
        return data.Response.NewID
      }
      throw new Error(data.Message);
    })
    .catch((err) => console.log("ERROR uploading image: ", err))
  ;

  return imageId;
}

export const getImage = (imageId: string) => {
  const image = fetch(`/api/filesystem/get/published?DocumentID=${imageId}`, {
    method: "GET"
  })
  .then(rawData => rawData.json())
  .then(resp => resp.Response) 

  return image;
}