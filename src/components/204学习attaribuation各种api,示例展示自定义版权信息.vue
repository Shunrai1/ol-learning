/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-16
*/
<template>
    <div class="container">
        <h3>vue+openlayers：可控化版权信息，学习Attribution各种API，示例展示</h3>
        <p>大剑师兰特，还是大剑师兰特</p>
        <div id="vue-openlayers" class="map-x"></div>
		<div ref="outAttr" id="outAttr"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
	import { Attribution, defaults as defaultControls } from "ol/control";

    export default {
        name: 'zoom',
        data() {
            return {
                map: null
            }
        },
        methods: {
            initMap() {
 //核心代码                
let copyrightInfo =
  '<a href="https://blog.csdn.net/cuclife/article/details/126706466" target="_blank">&copy; 我的个性化版权信息</a> '

                 const inAttribution = new Attribution({
                   collapsible: true,  //加载时是否折叠
                   collapsed: true,   //加载时是否折叠
				   label:"C",          //折叠按钮的文字信息
				   tipLabel:'版权信息',  //折叠按钮的提示信息
				   collapseLabel:'>'   //未折叠时的收起按钮
                 });
				 
				 const outAttribution = new Attribution({
				   collapsible: false,  //加载时是否折叠
                   target:this.$refs.outAttr,
                   className: 'myCustomClass',
				   expandClassName:'myExpandClass',
				 });
				 

                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM({
								attributions: copyrightInfo
							})
                        })
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [114.064839, 22.548857],
                        zoom: 4
                    }),
					controls: defaultControls({ attribution: false }).extend([inAttribution,  outAttribution]),
                })
            }
        },
        mounted() {
            this.initMap()
        }
    }
</script>

<style scoped>
    .container{
        width: 840px;
        height: 580px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
	.myCustomClass{
       width: 100%;
	}
	.myExpandClass .ol-control button{
		background: #0000FF !important;
	}
</style>
