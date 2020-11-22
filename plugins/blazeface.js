import * as blazeface from "@tensorflow-models/blazeface";
import * as tensorflow from "@tensorflow/tfjs"


export default (ctx, inject) => {
    inject("blazeface", blazeface);
    inject("tensorflow", tensorflow);
};