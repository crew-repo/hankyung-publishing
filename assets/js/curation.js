/* UI */ ;
(function (window, document, $, undefined) {
  UI.curationSw = {
    sliderEl: '[data-slider="curation"]',
    defaultConfig: {
      observer: true,
      observeParents: true,
      initialSlide: 0,
      lazy: true,
      on: {
        init: function () {},
      },
    },
    setSwiper: function () {
      const that = this;
      $(this.sliderEl).each(function (idx, swEl) {
        setConfig = $(swEl).attr('data-swiper') ? JSON.parse(swEl.dataset.swiper) : {};
        swEl.options = Object.assign({}, that.defaultConfig, setConfig);

        if (typeof swEl.options.pagination !== 'undefined') {
          swEl.options.pagination.el = $(swEl).closest('.page-kv').find('.swiper-pagination')[0];
          if (swEl.options.pagination.type === 'fraction') {
            swEl.options.pagination.formatFractionCurrent = function (number) {
              if ($(swEl).attr('data-curation-type') === 'curation-b-01-02' && window.winWChk === 'mo') {
                const nowPage = number - 1 !== 0 ? number - 1 : $(swEl).find('.swiper-slide:not(.swiper-slide-duplicate)').length;
                return ('0' + nowPage).slice(-2);
              } else {
                return ('0' + number).slice(-2);
              }
            }
            swEl.options.pagination.formatFractionTotal = function (number) {
              return ('0' + number).slice(-2);
            }
            swEl.options.pagination.renderFraction = function (currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span><span class="bar"></span><span class="' +
                totalClass + '"></span>';
            }
          }
        }

        if (swEl.options.navigation === true) {
          swEl.options.navigation = {
            nextEl: $(swEl).closest('.page-kv').find('.swiper-next'),
            prevEl: $(swEl).closest('.page-kv').find('.swiper-prev'),
          }
        }

        if (swEl.options.loop === true) {
          swEl.options.loopedSlides = $(swEl).find('.swiper-slide').length
        }

        if ($(swEl).hasClass('kv-swiper__gallery') && window.winWChk === 'pc') {
          swEl.options.autoplay = false;
        }

        if (swEl.options.autoplay === true) {
          swEl.options.autoplay = {
            delay: 3000,
            disableOnInteraction: false,
          }
        }

        if ($(swEl).attr('data-curation-type') === 'curation-b-01-02') {
          if (window.winWChk === 'mo') {
            swEl.options.slidesPerView = 1
          } else {
            swEl.options.slidesPerView = 'auto'
          }
        }

        if ($(swEl).attr('data-curation-style') === 'active-bigger') {
          swEl.options.on.init = function () {
            $(swEl).find('.swiper-slide').addClass('changed');
          }
          swEl.options.on.slideChangeTransitionStart = function () {
            $(swEl).find('.swiper-slide').addClass('changing');
            $(swEl).find('.swiper-slide').removeClass('changed');
          }
          swEl.options.on.slideChangeTransitionEnd = function () {
            $(swEl).find('.swiper-slide').removeClass('changing');
            $(swEl).find('.swiper-slide').addClass('changed');
          }
        }

        if (typeof $(swEl).data('ui') === 'undefined') {
          if (typeof swEl.options.thumbs === 'undefined') {
            swInstance = new Swiper(swEl, swEl.options);
            $(swEl).data('ui', swInstance);
          } else {
            const mappingSw = $(swEl).closest('.kv-swiper-dual').find('.kv-swiper__thumbs')[0].swiper;
            swEl.options.thumbs.swiper = mappingSw;
            swInstance = new Swiper(swEl, swEl.options);
            $(swEl).data('ui', swInstance);
          }
          if (typeof swEl.options.autoplay !== 'undefined') {
            if (swInstance.params.autoplay.enabled === true) {
              that.autoplaySet(swInstance, true);
            } else {
              that.autoplaySet(swInstance, false);
            }
          }
        }
      })
    },
    autoplaySet: function (sw, autoplayFlag) {
      setTimeout(function () {
        if (autoplayFlag === true) {
          const controls = sw.pagination.$el.closest('.page-kv').find('.swiper-controls');
          if (controls.find('.btn-autoplay').length === 0) {
            controls.append(
              '<button type="button" class="swiper--play btn-autoplay"><span>??????</span></button><button type="button" class="swiper--pause btn-autoplay"><span>??????</span></span></button>'
            );
          }
          if (sw.autoplay.running) {
            controls.find('.swiper--play').addClass('disabled').css('display', 'none');
            controls.find('.swiper--pause').removeClass('disabled').css('display', '');
          } else {
            controls.find('.swiper--play').removeClass('disabled').css('display', '');
            controls.find('.swiper--pause').addClass('disabled').css('display', 'none');
          }

          controls.find('.swiper--play').off('click').on('click', function () {
            sw.autoplay.start();
            controls.find('.swiper--play').addClass('disabled').css('display', 'none');
            controls.find('.swiper--pause').removeClass('disabled').css('display', '');
          });
          controls.find('.swiper--pause').off('click').on('click', function () {
            sw.autoplay.stop();
            controls.find('.swiper--play').removeClass('disabled').css('display', '');
            controls.find('.swiper--pause').addClass('disabled').css('display', 'none');
          });
        } else {
          if (sw.autoplay.running === true) {
            sw.autoplay.stop();
          }
          sw.pagination.$el.closest('.page-kv').find('.btn-autoplay').remove();
        }
      }, 300);
    },
    init: function () {
      if ($(this.sliderEl).length > 0) {
        this.setSwiper();
      }
    },
    resize: function () {
      if ($(this.sliderEl).length) {
        const that = this;
        $(this.sliderEl).each(function (idx, swEl) {
          if (typeof $(swEl).data('ui') !== 'undefined') { //case: swiper initialized
            if ($(swEl).attr('data-curation-type') === 'curation-b-01-02') {
              if ($(swEl).data('ui').$el.attr('data-curation-type') === 'curation-b-01-02') {
                that.defaultConfig.initialSlide = window.winWChk === 'mo' ? $(swEl).data('ui').realIndex + 1 : $(swEl).data('ui').realIndex - 1;
                $(swEl).data('ui').destroy();
                $(swEl).removeData('ui');
                setTimeout(function () {
                  that.setSwiper();
                }, 300)
              }
            }
            if ($(swEl).hasClass('kv-swiper__gallery')) {
              if (window.winWChk === 'mo') {
                that.autoplaySet($(swEl).data('ui'), true);
                $(swEl).data('ui').autoplay.start();
              } else {
                that.autoplaySet($(swEl).data('ui'), false);
                $(swEl).data('ui').autoplay.stop();
              }
            }
          }
        });
      }
    },
  }
  UI.curationSw.init();

})(window, document, jQuery);