<template>
	<view class="rightContainer">
		<view class="picWrap">
			<image class="pic" :src="cateList.imgUrl">
		</view>
		<view class="goodsList">
			<ul class="list" v-if="cateList.categoryList">
				<li class="goodItem" v-for="(categoryItem,index) in cateList.categoryList" :key="index">
					<image class="goodItemPic" :src="categoryItem.bannerUrl">
					<view class="name">
						<text>{{categoryItem.name}}</text>
					</view>
				</li>
			</ul>
			<ul class="list" v-if="cateList.subCateList">
				<li class="goodItem" v-for="(subCateItem,index) in cateList.subCateList" :key="index">
					<image class="goodItemPic" :src="subCateItem.wapBannerUrl">
					<view class="name">
						<text>{{subCateItem.name}}</text>
					</view>
				</li>
			</ul>
		</view>
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
