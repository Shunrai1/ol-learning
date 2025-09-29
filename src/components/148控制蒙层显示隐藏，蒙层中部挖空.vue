/* * @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN） *
@此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com * @First published in xiaozhuanlan.com * @Second
published in CSDN * @First published time: 2022-10-18 */

<template>
  <div class="container">
    <h3>vue+openlayers: 蒙版图层遮罩内剪切，显示所画区域的底部地图图像</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="drawPolygon()"
        >画多边形</el-button
      >
      <el-button type="warning" size="mini" @click="startModify()"
        >修改边界</el-button
      >
      <el-button type="warning" size="mini" @click="endModify()"
        >停止编辑</el-button
      >
      <el-button type="success" size="mini" @click="MaskCrop()"
        >遮罩挖空</el-button
      >
      <el-button type="success" size="mini" @click="cancelMaskCrop()"
        >取消遮罩挖空</el-button
      >
    </h4>
    <div id="vue-openlayers"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import "ol-ext/dist/ol-ext.min.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import Stamen from "ol/source/Stamen";
import TileLayer from "ol/layer/Tile";
import Feature from "ol/Feature";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Mask from "ol-ext/filter/Mask";
import Crop from "ol-ext/filter/Crop";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import GroupLayer from "ol/layer/Group";
import XYZ from "ol/source/XYZ";
import MultiPoint from "ol/geom/MultiPoint";
export default {
  name: "draw-mask-crop",
  data() {
    return {
      map: null,
      osmLayer: null,
      geo_Layer: null,
      masklayer: null,
      mask: null,
      crop: null,
      areaFeature: null,
      draw: null,
      source: new SourceVector({
        wrapX: false,
      }),
      group: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    drawPolygon() {
      // 清除资源,只留一个图形
      this.source.clear();
      // 停止上一次的绘制，没有此代码会出现重叠
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw);
      }
      let type = "Polygon";
      this.draw = new Draw({
        source: this.source,
        type: type,
      });
      this.map.addInteraction(this.draw);
      this.draw.on("drawend", (e) => {
        this.map.removeInteraction(this.draw);
      });
    },
    //开始编辑
    startModify() {
      this.modify = new Modify({
        source: this.source,
      });
      this.map.addInteraction(this.modify);
    },
    //停止编辑
    endModify() {
      if (this.modify !== null) {
        this.map.removeInteraction(this.modify);
      }
    },

    cancelMaskCrop() {
      this.masklayer.setVisible(false);
      if (this.mask) {
        this.mask.set("active", false);
      }
      if (this.crop) {
        this.crop.set("active", false);
      }
    },
    MaskCrop() {
      this.cancelMaskCrop();
      let f = this.source.getFeatures();
      this.crop = new Crop({
        feature: f[0],
        wrapX: true,
        inner: true,
      });
      this.masklayer.setVisible(true);

      this.mask = new Mask({
        feature: f[0],
        wrapX: true,
        inner: false,
        fill: new Fill({
          color: [255, 255, 0, 0.5],
        }),
      });
      this.masklayer.addFilter(this.mask);
      this.masklayer.addFilter(this.crop);
    },

    initMap() {
      this.masklayer = new TileLayer({
        source: new Stamen({
          layer: "watercolor",
        }),
        visible: false,
      });

      this.osmLayer = new TileLayer({
        source: new OSM(),
      });

      let vector = new LayerVector({
        source: this.source,
        style: [
          new Style({
            fill: new Fill({
              color: "transparent",
            }),
            stroke: new Stroke({
              width: 2,
              color: "blue",
            }),
          }),
          new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: "red",
              }),
              stroke: new Stroke({ color: "orange", width: 2 }),
            }),
            geometry: function (feature) {
              var coordinates = feature.getGeometry().getCoordinates()[0];
              return new MultiPoint(coordinates);
            },
          }),
        ],
      });

      this.group = new GroupLayer({
        layers: [],
      });
      this.group.getLayers().getArray().push(this.osmLayer);

      this.map = new Map({
        layers: [this.group, vector, this.masklayer],
        view: new View({
          center: [116, 39.5],
          zoom: 8,
          projection: "EPSG:4326",
        }),
        target: "vue-openlayers",
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 840px;
  height: 570px;
  margin: 50px auto;
  border: 1px solid #42b983;
}

#vue-openlayers {
  width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #42b983;
  position: relative;
}
</style>
