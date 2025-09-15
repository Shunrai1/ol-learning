/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-15
*/

<template>
    <div class="container">
        <h3>vue+openlayers：加载静态图片，变成地图一部分</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
	import Image from 'ol/layer/Image';
	import ImageStatic from 'ol/source/ImageStatic';
	import Projection from 'ol/proj/Projection';
	
export default {
  data() {
    return {
        map:null,
    };
  },

  methods:{
// 初始化地图     
     initMap(){      

			let extent = [0, 0, 601, 476];
			       let projection = new Projection({
			           code: 'proj',
			           units: 'pixels',
			           extent: extent
			       });
			
			let myLayer=new Image({
                    source: new ImageStatic({
                        url: '/data/satellite-map.jpg',
                        projection: projection,
                        imageExtent: extent
                    })
                })

            this.map= new Map({
                    target: "vue-openlayers",
                    layers: [
                        myLayer
                    ],
					 view: new View({
							projection: projection,
							center: [300, 238],
							zoom: 3
						})
                  })
            },
  },  
  mounted() {
            this.initMap()
          }
      }

</script>
<style scoped>
    .container{
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 450px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
