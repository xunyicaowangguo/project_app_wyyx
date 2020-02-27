<template>
	<view class="rightContainer">
		
	</view>
</template>

<script>
	import cateLists from '../../common/datas/cateLists.json'
	export default {
		props:["currentId"],
		data() {
			return {
				cateLists: [],
				cateList: {},
			}
		},
		mounted() {
			console.log(this.$props)
			this.cateList = cateLists.find(item => item.id == this.$props.currentId)
			// console.log(this.cateList)
		},
		watch:{
			currentId: function(val,oldVal){
				console.log(val,oldVal)
				this.cateList = cateLists.find(item => item.id == val)
				// console.log(this.cateList)
			}
		}
	}
</script>

<style lang="scss">
.rightContainer{
	width: 588upx;
	height: 2000upx;
	background-color: rgba(0,0,0,0.5);
}
</style>
