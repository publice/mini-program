import wepy from 'wepy'

export default class mixin extends wepy.mixin {
    data = {
        mini: wepy.getStorageSync('mini')
    }

    methods = {}

    onShow() {

    }

    onLoad() {

    }
}
