import * as DocumentPicker from "expo-document-picker";

// import RNFetchBlob from "rn-fetch-blob";
const useAttachmentPicker = async () => {
  const result = DocumentPicker.getDocumentAsync({
    type: "image/*",
  });
  const attachment = result[0];
  console.log("attachment", result);

  //   RNFetchBlob.fs.readFile(attachment.uri, "base64").then(async (data) => {
  //     console.log("attachment data", data);
  //     // handle the data ..
  //     const buffer = Buffer.from(data, "base64");

  //     return buffer;
  //   });
};
export default useAttachmentPicker;
