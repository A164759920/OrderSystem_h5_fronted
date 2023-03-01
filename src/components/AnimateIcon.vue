<template>
    <div class="Ani-container" :style="setElStyle">
        <div class="icon">图标</div>
    </div>
</template>

<script>
export default {
    name: "AnimateIconVue",
    data: function () {
        return {
            iconClassName: ""
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
    },
    mounted: function () {
        const animateList = document.getElementsByClassName("icon")
        // 正确写法
        animateList[animateList.length-1].classList.add("Ani-run-animate")
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
        background-color: aqua;
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
        transform: scale(0.9)
    }

    60% {
        transform: scale(0.8)
    }

    100% {
        top: var(--yEnd);
        transform: scale(0.7);
    }
}
</style>