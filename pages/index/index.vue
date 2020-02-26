<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-header-box">
			<view class="search-box">
				<view class="logoWrap">
					<view class="logo"></view>
				</view>
				<view class="ser-input">
					<icon class="search-icon" type="search" size="14"></icon>
					<text>搜索商品:共22046款好物</text>
				</view>
				<view class="loginbtn">登录</view>
			</view>
			<view class="tab-box">
				<view class="scroll-box">
					<scroll-view class="scroll-view" scroll-x="true">
						<view class="scroll-view-item"
							@click="activeName('推荐')"
							:class="{active:activeIndex=='推荐'?true:false}"
							>推荐</view>
						<view class="scroll-view-item" 
							v-for="(item,index) in indexSwiperData" :key="index"
							@click="activeName(index)"
							:class="{active:activeIndex==index?true:false}"
							>{{item.name}}</view>
					</scroll-view>
				</view>
				<view class="toggleWrap">
					<view class="white"></view>
					<view class="toggle" @click="toggleActive" :class="{active:toggleIsActive}">
						<view class="icon"></view>
					</view>
					<view class="extend" :class="{extendActive:toggleIsActive}">
						<view class="tabalter">全部频道</view>
						<view class="alltabs">
							<view class="tab-item"
								@click="activeName('推荐')"
								:class="{active:activeIndex=='推荐'?true:false}"
								>推荐</view>
							<view class="tab-item" 
								v-for="(item,index) in indexSwiperData" :key="index"
								@click="activeName(index)"
								:class="{active:activeIndex==index?true:false}"
								>{{item.name}}</view>
						</view>
					</view>
				</view>
				<view class="mask" :class="{maskActive:toggleIsActive}"></view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 小程序中心区域 -->
		<view class="mp-main-box">
			<!-- 头部轮播 -->
			<view class="uni-padding-wrap">
				<view class="page-section-spacing">
					<swiper class="swiper" indicator-dots="true" indicator-color="#fff" indicator-active-color="#dd1a21" autoplay="true" interval="3000" duration="500" circular="true">
						<swiper-item v-for="(item,index) in indexSwiperData" :key="index">
							<image class="swiperPic" :src="item.imgUrl">
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!-- 特征 -->
			<view class="charact">
				<view class="charactItem" v-for="(item,index) in indexDate.policyDescList" :key="index">
					<image :src="item.icon"></image>
					<view class="text">{{item.desc}}</view>
				</view>
			</view>
			<!-- 分类 -->
			<view class="cate-section">
				<view class="cate-item" v-for="(item,index) in indexDate.kingKongModule.kingKongList" :key="index">
					<image :src="item.picUrl"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
			<!-- 图片广告 -->
			<view class="ad-1">
				<view class="ad-1-pic">
					<image src="https://yanxuan-item.nosdn.127.net/9cdae54c3c2434ed1f6f2fa6d5fa270d.png?imageView&thumbnail=168x0&quality=75"></image>
					<view class="price">
						<text>￥398</text>
						<s>￥428</s>
					</view>
				</view>
			</view>
			<view class="ad-2"></view>
			<view class="ad-3">
				<view class="ad-3-item ad-3-1">
					<view class="title">超值特卖</view>
					<view class="desc">低至2折</view>
					<image src="https://yanxuan-item.nosdn.127.net/7fd16a14df663976505374d66b99e90e.png?quality=75&type=webp&imageView&thumbnail=160x160"></image>
				</view>
				<view class="ad-3-item ad-3-2">
					<view class="title">防疫专区</view>
					<view class="desc">防疫日用</view>
					<image src="https://yanxuan-item.nosdn.127.net/93a20b799b978c1b3e800ce3f0e16842.png?quality=75&type=webp&imageView&thumbnail=160x160"></image>
				</view>
				<view class="ad-3-item ad-3-3">
					<view class="title">春日物语</view>
					<view class="desc">新品上新</view>
					<image src="https://yanxuan-item.nosdn.127.net/190ef99484d669354838b4f37e0dd336.png?quality=75&type=webp&imageView&thumbnail=160x160"></image>
				</view>
			</view>
			<view class="ad-4"></view>
			<!-- 新人专享礼 -->
			
			<!-- 类目热销榜 -->
			
			<!-- 限时购 -->
			
			<!-- 新品首发 -->
			
			<!-- 断货回购 -->
			
		</view>
		<!-- 小程序底部 -->
		<view class="bottomContainer">
			<view class="bottom">
				<view class="down">
					<navigator url="/downloadapp?_stat_from=search_pz_baidu_29&amp;appAwakeUrl=http%3a%2f%2fm.you.163.com" hover-class="navigator-hover">下载APP</navigator>
					<navigator url="">电脑版</navigator>
				</view>
				<view class="copyright">
					<p>网易公司版权所有 © 1997-2020</p>
					<p>食品经营许可证：JY13301080111719</p>
				</view>
			</view>
		</view>
		
	
	</view>
</template>

<script>
	import indexSwiperData from '../../common/datas/indexCateModule.json'
	import indexDate from '../../common/datas/index.json'
	export default {
		data() {
			return {
				indexSwiperData: [],
				indexDate: {},
				activeIndex: '推荐',
				toggleIsActive: false,
				
				
			}
		},
		
		mounted() {
			this.indexSwiperData = indexSwiperData
			this.indexDate = indexDate
		},
		
		
		
		methods: {
			//头部滚动条
			activeName(index){
				this.activeIndex = index
			},
			//点击三角切换
			toggleActive(){
				this.toggleIsActive = !this.toggleIsActive
			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			
			//轮播图切换修改背景色
			/*swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},*/
			
			//详情页
			/*navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},*/
		}
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-header-box{
		position:fixed;
		left: 0;
		top: 0;
		z-index: 9999;
		width: 750upx;
		height: 148upx;
		background: #fff;
		.search-box{
			padding: 16upx 30upx;
			display: flex;
			width: 750upx;
			height: 88upx;
			background-color: #fff;
			position: relative;
			left: 0;
			top: 0;
			z-index: 9;
			.logoWrap{
				width: 138upx;
				height: 56upx;
				padding: 8upx 0;
				margin-right: 20upx;
				.logo{
					width: 138upx;
					height: 40upx;
					background-image: url(//yanxuan-static.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/indexLogo-a90bdaae6b.png?imageView&type=webp);
					background-size: 138upx 40upx;
				}
			}
			.ser-input{
				flex:1;
				width: 442upx;
				height: 56upx;
				line-height: 56upx;
				text-align: center;
				font-size: 28upx;
				color: #666;
				border-radius: 5px;
				background: #ededed;
				display: flex;
				align-items: center;
				justify-content: center;
				.search-icon{
					margin: 20upx 10upx 0 0;
					font-size: 14upx;
				}
			}
			.loginbtn{
				width: 74upx;
				height: 40upx;
				margin: 8upx 0 8upx 16upx;
				border-radius: 6upx;
				border: 1px solid #dd1a21;
				text-align: center;
				line-height: 38upx;
				font-size: 24upx;
				color: #dd1a21;
			}
		}
		.tab-box{
			width: 750upx;
			height: 60upx;
			position: relative;
			.scroll-box{
				width: 650upx;
				height: 60upx;
				// overflow: hidden;
				.scroll-view{
					background-color: #567;
					height: 60upx;
					width: 1460upx;
					padding: 0 30upx;
					display: flex;
					flex-wrap: nowrap;
					.scroll-view-item{
						display: inline-block;
						line-height: 60upx;
						padding: 0 16upx;
						font-size: 28upx;
						color: #333;
						margin-left: 20upx;
						position: relative;
						&:first-child{
							margin-left: 0;
						}
						&.active{
							color: #dd1a21;
							&::after{
								display: block;
								content: '';
								width: 100%;
								height: 4upx;
								position: absolute;
								left: 0;
								bottom: 0;
								background: #dd1a21;
							}
						}
					}
				}
			}
			.toggleWrap{
				width: 160upx;
				height: 60upx;
				position: absolute;
				right: 0;
				top: 0;
				z-index: 5;
				display: flex;
				.white{
					width: 60upx;
					height: 60upx;
					background-image: linear-gradient(to right,rgba(255,255,255,0) 0,#fff 100%);
				}
				.toggle{
					width: 100upx;
					height: 60upx;
					text-align: center;
					background: #fff;
					position: relative;
					z-index: 9;
					&.active{
						transform: rotate(180deg);
					}
					.icon{
						width: 30upx;
						height: 30upx;
						background-image: url(//yanxuan-static.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/arrow-down-3-9b31adfa37.png?imageView&type=webp);
						background-size: 30upx 30upx;
						margin: 15upx 35upx;
					}
				}
				.extend{
					width: 750upx;
					height: 372upx;
					background-color: #fff;
					position: absolute;
					right: 0;
					top: 0;
					display: none;
					&.extendActive{
						display: block;
					}
					.tabalter{
						width: 750upx;
						height: 60upx;
						padding-left: 30upx;
						font-size: 28upx;
						color: #333;
						line-height: 60upx;
					}
					.alltabs{
						width: 750upx;
						height: 312upx;
						padding-top: 24upx;
						.tab-item{
							display: inline-block;
							width: 150upx;
							height: 56upx;
							border: 1px solid #ccc;
							margin: 0 0 40upx 30upx;
							color: #333;
							font-size: 24upx;
							background-color: #fafafa;
							text-align: center;
							line-height: 54upx;
							border-radius: 4upx;
							&.active{
								color: #dd1a21;
								border-color: #dd1a21;
							}
						}
					}
				}
			}
			.mask{
				width: 750upx;
				height: 1334upx;
				background-color: rgba(0,0,0,0.5);
				position: absolute;
				top: -88upx;
				left: 0;
				z-index: 1;
				display: none;
				&.maskActive{
					display: block;
				}
			}
		}
	}
	
	/*
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	*/
	/* #endif */
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	
	/* 中间部分 */
	.mp-main-box{
		margin-top: 148upx;
		/* 头部 轮播图 */
		.uni-padding-wrap{
			width: 750upx;
			height: 300upx;
			.page-section-spacing{
				.swiper{
					.swiperPic{
						width: 750upx;
						height: 300upx;
					}
				}
			}
		}
		/* 特征 */
		.charact{
			width: 750upx;
			height: 72upx;
			padding: 0 30upx;
			background: #fff;
			display: flex;
			justify-content: space-between;
			.charactItem{
				display: flex;
				align-items: center;
				image{
					width: 32upx;
					height: 32upx;
				}
				.text{
					font-size: 24upx;
					color: #333;
					margin-left: 8upx;
				}
			}
		}
		/* 分类 */
		.cate-section {
			width: 750upx;
			height: 341upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap:wrap;
			background: #fff;
			.cate-item {
				width: 110upx;
				height: 156upx;
				margin: 10upx 20upx 9upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24upx;
				color: #333;
				
				/* 原图标颜色太深:不想改图了:所以加了透明度 */
				image {
					width: 110upx;
					height: 110upx;
				}
				
				text{
					display: inline-block;
					height: 36upx;
					width: 110upx;
					margin-top: 10upx;
					text-align: center;
				}
			}
			
		}
		/* 图片广告 */
		.ad-1{
			width: 750upx;
			height: 240upx;
			background: url(https://yanxuan.nosdn.127.net/8115886c8e4311bd0a9851dae194ebed.gif?imageView&quality=75);
			background-size: 100% 100%;
			position: relative;
			.ad-1-pic{
				width: 168upx;
				height: 168upx;
				position: absolute;
				left: 76upx;
				top: 35upx;
				image{
					width: 168upx;
					height: 168upx;
				}
				.price{
					width: 152upx;
					height: 32upx;
					border-radius: 16upx;
					background: #f48f18;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					left: 8upx;
					bottom: 10upx;
					text{
						font-size: 20upx;
					}
					s{
						font-size: 16upx;
					}
				}
			}
		}
		.ad-2{
			width: 750upx;
			height: 180upx;
			padding: 20upx 20upx 0;
			background: #67a560 url(https://yanxuan.nosdn.127.net/0052ade75d710bff45322e9b2e590d14.gif?imageView&quality=75);
		    background-size: 710upx 160upx;
			background-repeat: no-repeat;
			background-position: 20upx 20upx;
		}
		.ad-3{
			width: 750upx;
			height: 236upx;
			padding: 8upx 20upx;
			background: #67a560;
			display: flex;
			justify-content: space-around;
			.ad-3-item{
				width: 230upx;
				height: 220upx;
				background: url(https://yanxuan.nosdn.127.net/c5a17762a9e287a3ce779204a7916703.png?quality=75&type=webp&imageView&thumbnail=250x0);
				background-size: 230upx 220upx;
				.title{
					color: #333;
					font-size: 24upx;
					text-align: center;
					font-weight: bold;
					margin-top: 10upx;
				}
				.desc{
					color: #208a42;
					font-size: 20upx;
					text-align: center;
					margin-top: 5upx;
				}
				image{
					width: 140upx;
					height: 140upx;
					margin: 5upx 40upx 0;
				}
			}
		}
		.ad-4{
			width: 750upx;
			height: 100upx;
			padding: 0 20upx 20upx;
			background:#67a560 url(https://yanxuan.nosdn.127.net/ba0ae82c90f533c74535cd65c043be34.png?quality=75&type=webp&imageView&thumbnail=750x0);
			background-size: 710upx 80upx;
			background-repeat: no-repeat;
			background-position: 20upx 0;
		}
	
	 	/* 新人专享礼 */
		
	}
	
	/* 底部 */
	.bottomContainer{
		width: 100%;
		height: 122px;
		margin-bottom: 50px;
		padding: 27px 10px 14px;
		box-sizing: border-box;
		border-top: 1px solid rgba(0,0,0,.15);
		background-color: #414141;
		.bottom{
			width: 100%;
			height: 81px;
			.down{
				padding: 0 76px;
				navigator{
					display: inline-block;
					width: 86px;
					height: 31px;
					border: 1px solid #999;
					border-radius: 4px;
					color: #ffffff;
					text-align: center;
					line-height: 29px;
					&:first-child{
						margin-right: 25px;
					}
				}
			}
			.copyright{
				margin-top: 13px;
				p{
					color: #999;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
					padding: 2px;
				}
			}
		}
	}
	  
</style>
