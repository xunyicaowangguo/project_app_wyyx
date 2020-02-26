<template>
  <view id="container">
      <view class="title">
          <slot name="title"></slot>
      </view>
      <view class="contentcontainer">
          <slot name="content"></slot>
      </view>
      <view class="bottom"></view>
  </view>
</template>

<script>
  export default {
  }
</script>

<style scoped lang='scss'>
	#container{
		width: 100%;
		font-size: 16px;
		.contentcontainer{
			padding: 0 15px 15px;
		}
		.bottom{
			width: 100%;
			height: 10px;
			background: #ededed;
		}
	}
</style>
