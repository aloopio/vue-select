<style lang="scss" src="./style.scss" scoped></style>
<script src="./script"></script>
<template>
<div class="app-multi-select" :class="customClass" :style="customStyle" ref="container">
  <div class="app-multi-select__selection" :class="'selection-' + (variant  || 'default')">
    <span class="label" v-if="label">{{label}}<span v-if="arrVal.length">:</span></span>
    <span class="plh" v-else-if="placeholder && !arrVal.length">{{ placeholder }}</span>
    <span class="value">
      <div class="item-image" v-for="(item, i) in selectedObjects" :key="i"><div :style="{backgroundImage: `url(${$file.url(item.image)})`}" class="avatar" v-if="item.image"></div>{{item.label ? item.label : '(rỗng)'}}<span v-if="i < arrVal.length - 1">, </span></div>
    </span>
    <span class="count-number" v-if="(!max || max > 1) && arrVal.length">({{arrVal.length}})</span>
    <span class="icon clear" @click="onClear($event)" v-if="arrVal.length && !required"><i class="fa fa-close"></i></span>
    <span class="icon"><i class="fa fa-chevron-down"></i></span>
  </div>
  <div class="app-multi-select__datalist">
    <div class="control-all" @click="onCheckAll()" v-if="(!max || max > 1) && options.length > 1 ">
      <label class="check-mark" :class="{checked: arrVal.length == options.length}"><i v-if="arrVal.length == options.length" class="fas fa-check"></i></label>
      <span>Chọn tất cả</span>
    </div>
    <div class="app-multi-select__search" v-if="options.length > 1 || addable">
      <i class="fas fa-search" v-if="options.length > 1 && !showAddable"></i>
      <i class="fas fa-plus" @click="onAdd()" v-else></i>
      <input type="text" autocomplete="off" ref="search" @keyup.enter="onAdd()" v-model="search" name="search" :placeholder="addable ? 'Thêm mới hoặc tìm kiếm...' : 'Tìm kiếm...'">
    </div>
    <div>
      <ul>
        <li v-if="showAddable" class="add-value">
          <span>Nhấn enter hoặc dấu <i class="fas fa-plus"></i> để thêm <i class="text-info">{{ search }}</i></span>
        </li>
        <li v-for="(item, i) in filters" @click="onClickItem(item.value)" :key="i" :class="{active: arrVal.includes(item.value)}">
          <label class="check-mark" v-if="max !== 1" :class="{checked: arrVal.includes(item.value.toString())}"><i v-if="arrVal.includes(item.value.toString())" class="fas fa-check"></i></label>
          <span><div class="item-image"><div :style="{backgroundImage: `url(${$file.url(item.image)})`}" class="avatar" v-if="item.image"></div>{{item.label ? item.label : '(rỗng)'}}</div></span>
          <span class="description" v-if="item.description">{{item.description}}</span>
        </li>
      </ul>

      <span class="no-item" v-if="filters.length == 0">No data</span>
    </div>
  </div>
</div>
</template>