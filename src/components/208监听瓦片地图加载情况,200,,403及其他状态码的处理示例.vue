
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-02-09
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 监听瓦片地图加载情况，200,403，及其他状态码的处理示例</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
		<div class="dialog" v-show="isOpen">出错了，出错了！ <br>
		<span @click="close()">关闭</span>
		</div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import XYZ from 'ol/source/XYZ'
    import TileState from 'ol/TileState.js';
    export default {
        data() {
            return {
                map: null, 
				mysource:null, 
				isOpen:false,
            };
        },

        methods: {
          close(){
			  this.isOpen=false;
		  },
           getStatus(){
			   this.mysource.setTileLoadFunction((tile, src)=>{  //参考source的TileLoadFunction属性
				  const xhr = new XMLHttpRequest();
				  //xhr.timeout =3000;  //设定超时时间，超时后，任务取消
				  xhr.responseType = 'blob';
				  xhr.addEventListener('loadend', (evt)=>{
					let status = evt.currentTarget.status;			  
				    const data = evt.currentTarget.response;

				    if (status ==200) {
				      tile.getImage().src = URL.createObjectURL(data);
				    } else if(status ==403){
						console.log(status)
						this.isOpen=true;				     
				    }else{
					  tile.setState(TileState.ERROR);	
					}
				  });
				  xhr.addEventListener('error', ()=> {
					  this.isOpen=true;	
				    tile.setState(TileState.ERROR);
				  });
				  xhr.open('GET', src);
				  xhr.send();
				});
		   },


            initMap() {
				this.mysource=new XYZ({
						url:'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
						new TileLayer({
							source: this.mysource
						})
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [-100.15, 16.79],
                        zoom: 5
                    }),
                })
            },
        },
        mounted() {
            this.initMap();
			this.getStatus()
        }
    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
		position: relative;
    }
    #vue-openlayers {
        width: 800px;
        height: 450px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
	.dialog{
		width: 600px;
		height: 100px;
		background: #FF0000;
		position: absolute;
		left: 120px;
		top:150px ;
		padding:30px 30px 0;		
	}
</style>

