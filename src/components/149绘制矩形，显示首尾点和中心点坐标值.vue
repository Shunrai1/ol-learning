/* * @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN） *
@此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com * @First published in xiaozhuanlan.com * @Second
published in CSDN * @First published time: 2022-10-19 */

<template>
  <div class="container">
    <h3>
      vue+openlayers: 绘制矩形，显示首尾点和中心点坐标值，同时获取所有点的经纬度
    </h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
    <h4>
      <el-button type="primary" size="mini" @click="drawPolygon('Rectangle')"
        >绘制矩形</el-button
      >
    </h4>
    <div id="vue-openlayers"></div>
    <div id="coordinateInfo" v-show="isShowInfo"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import Feature from "ol/Feature";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Draw, { createBox } from "ol/interaction/Draw";
import MultiPoint from "ol/geom/MultiPoint";
import { getCenter } from "ol/extent";
import { Point } from "ol/geom";

export default {
  name: "draw-mask-crop",
  data() {
    return {
      map: null,
      osmLayer: null,
      draw: null,
      source: new SourceVector({ wrapX: false }),
      pointSource: new SourceVector({ wrapX: false }),
      isShowInfo: false,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 点的样式
    pointStyle(text) {
      let style = new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: "#f0f",
          }),
        }),
        text: new Text({
          font: "12px arial", // 设置字体
          maxAngle: 30,
          offsetx: 50, // 设置文字偏移量
          offsetY: 20,
          text: text, // 文字描述
          fill: new Fill({
            color: "#f0f",
          }),
          backgroundFill: new Fill({
            color: "rgba(255,255,255,0.6)",
          }),
          // backgroundStroke: new Stroke({
          //         color: 'rgba(255,0,0,0.6)',
          //         width: 2,
          //     }),
        }),
      });
      return style;
    },

    // 显示点信息
    showPoint(coord, text) {
      let pointFeature = new Feature({
        geometry: new Point(coord),
      });
      pointFeature.setStyle(this.pointStyle(text));
      this.pointSource.addFeature(pointFeature);

      let pointLayer = new LayerVector({
        source: this.pointSource,
      });
      this.map.addLayer(pointLayer);
    },
    //格式化坐标数据
    numfixed2(array) {
      let a1 = array[0].toFixed(2);
      let a2 = array[1].toFixed(2);
      return [Number(a1), Number(a2)];
    },
    drawPolygon(x) {
      // 清除资源,只留一个图形
      this.source.clear();
      // 停止上一次的绘制，没有此代码会出现重叠
      if (this.draw !== null) {
        this.map.removeInteraction(this.draw);
      }

      let type = "Circle";
      let geometryFunction = createBox();

      this.draw = new Draw({
        source: this.source,
        type,
        geometryFunction,
      });
      this.map.addInteraction(this.draw);

      this.draw.on("drawstart", (e) => {
        this.isShowInfo = false;
      });

      const infobox = document.getElementById("coordinateInfo");
      this.draw.on("drawend", (e) => {
        this.isShowInfo = true;
        let feature = e.feature;
        let geom = feature.getGeometry();
        let f = this.numfixed2(geom.getLastCoordinate());
        let i1 = JSON.stringify(f); //第一点和最后点是一样的,都是左下点
        let i2 = JSON.stringify(geom.getCoordinates()[0]);
        let c = this.numfixed2(new getCenter(geom.getExtent()));
        let i3 = JSON.stringify(c);
        this.showPoint(f, i1);
        this.showPoint(c, i3);

        infobox.innerHTML = ` 所有点:${i2} `;
        this.map.removeInteraction(this.draw);
      });
    },

    initMap() {
      this.osmLayer = new TileLayer({
        source: new OSM(),
      });

      let drawLayer = new LayerVector({
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
              stroke: new Stroke({
                color: "orange",
                width: 2,
              }),
            }),
            geometry: function (feature) {
              var coordinates = feature.getGeometry().getCoordinates()[0];
              return new MultiPoint(coordinates);
            },
          }),
        ],
      });

      this.map = new Map({
        layers: [this.osmLayer, drawLayer],
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
  position: relative;
}

#vue-openlayers {
  width: 800px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #42b983;
  position: relative;
}

#coordinateInfo {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  z-index: 100;
  font-size: 12px;
  background-color: aliceblue;
}
</style>
