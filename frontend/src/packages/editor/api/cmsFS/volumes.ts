// TODO: remove this and replace with API client once thats complete, see:
// https://github.com/csesoc/website/pull/238
export const publishDocument = (documentId: string) => {
    fetch("/api/filesystem/publish-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          DocumentID: `${documentId}`,
        }),
    });
}

// upload an image to the docker volume
export const publishImage = (documentId: string, imageSrc: string) => {
  const imageId = fetch("/api/filesystem/upload-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      Parent: `${documentId}`,
      // TODO: find out what you're supposed to pass for
      // LogicalName and OwnerGroup
      LogicalName: "foo",
      OwnerGroup:  "0",
      Image: imageSrc
    }),
  })
  .then(rawData => rawData.json())
  .then(data => data.Response.NewID)
  .catch((err) => console.log("ERROR uploading image: ", err));
  ;

  return imageId;
}