<template>
		<div class="shopCard-1">
			<div class="margin-top"></div>
			<ShopCard>
					<template v-slot:title>
					  <div class="headerTitle">
						<span> 新人专享礼 </span>
					  </div>
					</template>
					<template v-slot:content>
					  <div class="middle">
						<div class="left">
						  <a href="https://m.you.163.com/gift/newWapUserGift">
							<div class="title">新人专享礼包</div>
							<img src="https://yanxuan.nosdn.127.net/ba4d635ec94ad95b28bfab6500900659.png">
						  </a>
						</div>
						<div class="right">
						  <div class="item-top">
							<a href="https://m.you.163.com/saleCenter/index">
							  <div class="title">福利社</div>
							  <div class="subTitle">今日特价</div>
							  <img src="https://yanxuan-item.nosdn.127.net/f961b628a67e5a95150b962a48963b6d.png">
							</a>                
						  </div>
						  <div class="item-bottom">
							<a href="https://m.you.163.com/pin/item/list">
							  <div class="title">新人拼团</div>
							  <div class="subTitle">1元起包邮</div>
							</a>  
						  </div>
						</div>
					  </div>
					</template>
			</ShopCard>
			
		</div>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
