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