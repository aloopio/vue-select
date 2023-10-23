export default {
  props: [
    "size",
    "style",
    "variant",
    "type",
    "class",
    "relative",
    "data",
    "modelValue",
    "label",
    "max",
    "required",
    "width",
    "height",
    "mappingKeys",
    "disabled",
    "addable",
    "default",
    "placeholder"
  ],

  data() {
    return {
      lastestValue: null,
      open: false,
      search: "",
      closeAnyway: false,
    };
  },

  computed: {
    customClass() {
      let cls = {};

      if (this.class) {
        if (typeof this.class == 'string') {
          this.class.split(' ').forEach(el => {
            cls[el] = true;
          });
        } else {
          cls = this.class;
        }
      }
      
      return {
        ...cls,
        relative: this.relative,
        open: this.open,
        "size-sm": this.size == "sm",
      };
    },

    customStyle() {
      return {
        width: this.width || "240px",
        height: this.height || null,
        ...(this.style || {}),
      };
    },

    filters() {
      return this.options.filter((item) => {
        if (!this.search) {
          return true;
        }

        let lower = item.label.toLowerCase();
        let val = item.value.toLowerCase();
        let search = this.search.toLowerCase();

        return lower.includes(search) || val.includes(search) || item.keywords.filter(k => k.toLowerCase().includes(search)).length > 0;
      });
    },

    arrVal() {
      if (!this.modelValue) return [];

      if (typeof this.modelValue == "string" ) return this.modelValue.split(",");
      if (typeof this.modelValue == "number" ) return this.modelValue.toString().split(",");

      return this.modelValue;
    },

    selectedObjects() {
      let text = [];
      let allOptions = {};
      for (let i = 0; i < this.options.length; i++) {
        allOptions[this.options[i].value] = this.options[i];
      }

      this.arrVal.forEach((item) => {
        if (allOptions[item] !== undefined) {
          text.push(allOptions[item]);
        }
      });

      return text;
    },

    options() {
      if (!this.data) return [];

      let newOptions = [];
      this.data.forEach((item) => {
        if (item) {
          newOptions.push(this.convertItem(item));
        }
      });

      // Check if is content change
      if (
        this.required &&
        newOptions.length > 0 &&
        this.arrVal.length == 0
      ) {
        let newVal = [];
        
        if (this.default == 'all') {
          newVal = newOptions.map(item => item.value);
        } else {
          newVal = [newOptions[0].value];
        }

        this.onChange(newVal);
      }

      return newOptions;
    },

    showAddable() {
      return this.addable && this.search && this.filters.filter(item => item.value.toLowerCase() === this.search.toLowerCase()).length == 0;
    },

    isValueChanged() {
      return this.lastestValue != JSON.stringify(this.arrVal);
    },

    isCheckall() {
      return this.filters.filter(item => this.arrVal.includes(item.value)).length == this.filters.length;
    }
  },

  methods: {
    onClear(e){
      e.preventDefault();
      e.stopPropagation();
      this.onChange([]);
    },

    onChange(value) {
      let val = this.type == "string" ? value.join(",") : value;
      if (this.type == "string") this.$emit("update:modelValue", val);
      else this.$emit("update:modelValue", val);
      this.$emit('change', val);
    },

    convertItem(item) {
      if (typeof item == "string") {
        return {
          label: item,
          value: item,
          description: '',
          image: null,
          keywords: []
        };
      }

      if (this.mappingKeys) {
        let d = {
          label: item[this.mappingKeys.label || "label"],
          value: '' + item[this.mappingKeys.value || "value"],
          description: item[this.mappingKeys.description || "description"] || '',
          keywords: item[this.mappingKeys.keywords || "keywords"] || [],
          image: item[this.mappingKeys.image || "image"] || '',
        };

        if (typeof d.keywords == "string") {
          d.keywords = [d.keywords];
        }

        return d;
      }

      return item;
    },

    /**
     * Event when click on item in select
     */
    onClickItem(item) {
      if (this.options.length == 1 && this.required) {
        return;
      }

      let value;

      if (this.arrVal.includes(item)) {
        if (!this.required || this.arrVal.length > 1) {
          value = [...this.arrVal];
          value.splice(value.indexOf(item), 1);
          this.onChange(value);
        }

        return;
      }

      if (this.max && this.max == 1) {
        value = [item];
      } else if (this.max && this.arrVal.length == this.max) {
        return;
      } else {
        value = [...this.arrVal, item];
      }

      if (this.max === 1) this.closeAnyway = true;
      this.onChange(value);
    },

    /**
     * On checkall
     */
    onCheckAll() {
      if (this.options.length == 1 && this.required) {
        return;
      }
  
      let arr;
  
      if (this.isCheckall) {
        arr = [...this.arrVal];
  
        this.filters.forEach((item) => {
          arr.splice(arr.indexOf(item.value), 1);
        });
      } else {
        arr = this.filters.map(function(item){
          return item.value;
        });
      }
  
      this.onChange(arr);
    },

    clickout(event) {
      if (!this.$refs.container) return;
      if (this.disabled) {
        this.open = false;
        return;
      }
      
      if (this.$refs.container.contains(event.target)) {
        if (!this.open) {
          this.lastestValue = JSON.stringify(this.arrVal);
          this.$emit('open');
          window.setTimeout(() => {this.$refs.search && this.$refs.search.focus()}, 200);
        }
        
        if (this.open && this.closeAnyway) {
          this.$emit('close', {isValueChanged: this.isValueChanged});
        }

        this.open = this.closeAnyway ? false : true;
        this.closeAnyway = false;
      } else {
        if (this.open) {
          this.$emit('close', {isValueChanged: this.isValueChanged});
        }

        this.open = false;
      }
    },

    onAdd(){
      if (!this.showAddable) return;
      this.$emit("add", this.search);
      this.onClickItem(this.search);
    }
  },

  mounted() {
    document.body.addEventListener("click", this.clickout);
  },

  beforeDestroy() {
    document.body.removeEventListener("click", this.clickout);
  },
};
