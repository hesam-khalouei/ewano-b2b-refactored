
/* EWANO B2B — Purchase Credit Calculator */
(function () {
  'use strict';

  let initialized = false;

  function initCalculator() {
    const root = document.getElementById('creditCalc');

    if (!root || initialized) return;
    initialized = true;

    const FA = '۰۱۲۳۴۵۶۷۸۹';
    const INSTALLMENT_OPTIONS = [4, 6, 12, 18, 24];

    const el = {
      amount: document.getElementById('calcAmount'),
      countIdx: document.getElementById('calcCountIdx'),
      feeRate: document.getElementById('calcFeeRate'),
      feeInput: document.getElementById('calcFeeInput'),
      amountOut: document.getElementById('calcAmountOut'),
      countOut: document.getElementById('calcCountOut'),
      feeOut: document.getElementById('calcFeeOut'),
      inst: document.getElementById('calcInst'),
      formula: document.getElementById('calcFormulaText'),
      resBase: document.getElementById('calcResBase'),
      resFee: document.getElementById('calcResFee'),
      resCount: document.getElementById('calcResCount'),
      resTotal: document.getElementById('calcResTotal')
    };

    const fa = number =>
      Math.round(number)
        .toLocaleString('en-US')
        .replace(/,/g, '٬')
        .replace(/[0-9]/g, digit => FA[+digit]);

    const faDec = number =>
      String(number)
        .replace('.', '٫')
        .replace(/[0-9]/g, digit => FA[+digit]);

    function renderTicks(range, labels) {
      const box = range.parentNode.querySelector('.calc-ticks');
      if (!box) return;

      const min = +range.min;
      const max = +range.max;
      const step = +range.step;
      const count = labels
        ? labels.length
        : Math.round((max - min) / step) + 1;

      if (box.children.length !== count) {
        box.innerHTML = '';

        for (let index = 0; index < count; index++) {
          const dot = document.createElement('i');
          const label = document.createElement('b');

          label.textContent = labels
            ? labels[index]
            : fa((min + index * step) / 1e6);

          dot.appendChild(label);
          box.appendChild(dot);
        }
      }

      const currentValue = +range.value;

      for (let index = 0; index < count; index++) {
        const value = labels
          ? index
          : min + index * step;

        box.children[index].className =
          value < currentValue
            ? 'on'
            : Math.abs(value - currentValue) < 0.001
              ? 'cur'
              : '';
      }
    }

    function updateTrackFill(range, mode) {
      const fraction =
        (+range.value - +range.min) /
        (+range.max - +range.min);

      range.parentNode.style.setProperty('--f', fraction);

      if (mode === 'amount') {
        renderTicks(range, null);
      } else if (mode === 'count') {
        renderTicks(range, [
          '۴ ماهه',
          '۶ ماهه',
          '۱۲ ماهه',
          '۱۸ ماهه',
          '۲۴ ماهه'
        ]);
      } else if (mode === 'fee') {
        const marks = [0, 1, 1.9, 3, 4];
        const box = range.parentNode.querySelector('.calc-ticks');

        if (box.children.length !== marks.length) {
          box.innerHTML = '';

          marks.forEach(mark => {
            const dot = document.createElement('i');
            const label = document.createElement('b');

            label.textContent = faDec(mark) + '٪';
            dot.appendChild(label);
            box.appendChild(dot);
          });
        }

        const currentValue = +range.value;

        marks.forEach((mark, index) => {
          box.children[index].className =
            mark < currentValue
              ? 'on'
              : Math.abs(mark - currentValue) < 0.05
                ? 'cur'
                : '';
        });
      }
    }

    function updateCalculator() {
      const principal = +el.amount.value;
      const count =
        INSTALLMENT_OPTIONS[+el.countIdx.value] || 12;
      const feePercent = +el.feeRate.value;

      const basePerMonth = principal / count;
      const feePerMonth = principal * (feePercent / 100);
      const installment = basePerMonth + feePerMonth;
      const totalRepayment = installment * count;

      updateTrackFill(el.amount, 'amount');
      updateTrackFill(el.countIdx, 'count');
      updateTrackFill(el.feeRate, 'fee');

      el.amountOut.innerHTML =
        fa(principal) + '<small>تومان</small>';

      el.countOut.innerHTML =
        fa(count) + '<small>قسط ماهانه</small>';

      el.feeOut.innerHTML =
        faDec(
          feePercent.toFixed(1).replace(/\.0$/, '')
        ) + '<small>٪ ماهانه</small>';

      el.inst.textContent = fa(installment);

      el.formula.textContent =
        `(${principal.toLocaleString('en-US')} ÷ ${count}) + ` +
        `(${principal.toLocaleString('en-US')} × ${feePercent}%) = ` +
        `${Math.round(installment).toLocaleString('en-US')}`;

      el.resBase.textContent =
        fa(basePerMonth) + ' تومان';

      el.resFee.textContent =
        feePercent > 0
          ? fa(feePerMonth) + ' تومان'
          : 'بدون کارمزد (۰ تومان)';

      el.resCount.textContent =
        fa(count) + ' ماهه · کارمزد ' +
        faDec(feePercent) + '٪';

      el.resTotal.textContent =
        fa(totalRepayment) + ' تومان';
    }

    el.amount.addEventListener('input', updateCalculator);
    el.countIdx.addEventListener('input', updateCalculator);

    el.feeRate.addEventListener('input', () => {
      el.feeInput.value = el.feeRate.value;
      updateCalculator();
    });

    el.feeInput.addEventListener('input', () => {
      const value = parseFloat(el.feeInput.value);

      if (!Number.isNaN(value) && value >= 0 && value <= 10) {
        el.feeRate.value = Math.min(4, Math.max(0, value));
        updateCalculator();
      }
    });

    window.setCalcPreset = function (amount, countIndex, fee) {
      el.amount.value = amount;
      el.countIdx.value = countIndex;
      el.feeRate.value = fee;
      el.feeInput.value = fee;
      updateCalculator();
    };

    updateCalculator();
  }

  function waitForSlides() {
    if (document.getElementById('creditCalc')) {
      initCalculator();
    }
  }

  window.addEventListener('slidesLoaded', waitForSlides);

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      waitForSlides,
      { once: true }
    );
  } else {
    waitForSlides();
  }
})();
