<template>
    <div class="Ani-container" :class="setTmpClass" :style="setElStyle">
        <div class="icon">图标</div>
    </div>
</template>

<script>
export default {
    name: "AnimateIconVue",
    data: function () {
        return {
            iconClassName: "",
            tmp: "" // 时间戳
        }
    },
    props: {
        xStart: {
            type: String,
            default: "0"
        },

        yStart: {
            type: String,
            default: "0"
        }
        ,
        xEnd: {
            type: String,
            default: "0"
        },

        yEnd: {
            type: String,
            default: "0"
        }
    },
    computed: {
        setElStyle: function () {
            return [{
                '--yStart': this.yStart + "px",
            }, {
                '--yEnd': this.yEnd + "px"
            }, {
                '--xStart': this.xStart + "px"
            }, {
                '--xEnd': this.xEnd + "px"
            }]
        },
        // 为每个子组件设置唯一标识的时间戳classNam
        setTmpClass: function () {
            const tmpNow = Date.now()
            this.tmp = tmpNow
            return `${tmpNow}`
        }
    },
    mounted: function () {
        // 添加动画效果 用tmp来唯一标识每个节点，避免互相干扰
        const containerDiv = document.getElementsByClassName(this.tmp)[0]
        const iconDiv = containerDiv.children[0]
        iconDiv.classList.add("Ani-run-animate")
        iconDiv.addEventListener("animationend", (event) => {
            containerDiv.remove()
        })
    }
}
</script>

<style lang="scss">
.Ani-container {
    .icon {
        width: 50px;
        height: 50px;
        position: absolute;
        top: var(--yStart);
        left: var(--xStart);
        background-color: lightgray;
        z-index: 999;
        border-radius: 50%;
    }

    .Ani-run-animate {
        animation: run-X 0.5s 0.1s 1 linear, run-Y 0.5s 0.1s 1 cubic-bezier(.66, .1, 1, .41);
        animation-fill-mode: forwards;
    }
}

@keyframes run-X {
    0% {
        left: var(--xStart);
    }

    100% {
        left: var(--xEnd);
    }
}

@keyframes run-Y {
    0% {
        top: var(--yStart);
    }

    30% {
        transform: scale(0.9);
        rotate: (-30deg);
    }

    60% {
        transform: scale(0.8);
        rotate: (-60deg)
    }

    100% {
        top: var(--yEnd);
        transform: scale(0.7);
        rotate: (-90deg);

    }
}
</style>