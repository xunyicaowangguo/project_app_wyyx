<template>
	<view class="content">
		<!-- 左侧 -->
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in categoryL1List" 
				:key="item.id" class="f-item b-b" 
				:class="{active: item.id === currentId}" 
				@click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<!-- 右侧 -->
		<scroll-view scroll-y="true" class="right-aside">
			<rightCateLists :currentId="currentId"></rightCateLists>
		</scroll-view>
	</view>
</template>

<script>
	import cateNavDatas from '../../common/datas/cateNavDatas.json'
	import rightCateLists from '../../components/rightCateLists/rightCateLists.vue'
	export default {
		components:{rightCateLists},
		data() {
			return {
				categoryL1List: [],
				currentId: 11,
				cateLists: [],
				
				
			}
		},
		
		mounted() {
			this.categoryL1List = cateNavDatas.categoryL1List
			this.cateLists = cateLists
		},
	
		methods: {
			//一级分类点击
			tabtap(item){
				this.currentId = item.id;
				console.log(this.currentId)
			}
		}
	
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 162upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				width: 8upx;
				background-color: $base-color;
				border-radius: 4upx;
				opacity: .8;
			}
		}
	}
	
	.right-aside{
		width: 588upx;
		height: 1110upx;
		flex-shrink: 0;
	}

	
</style>
