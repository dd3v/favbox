export default {
  mounted(el, binding) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip z-1 bg-black text-white text-xs rounded shadow-md py-1 px-2 absolute whitespace-nowrap z-0 opacity-0 transition-opacity duration-300';
    tooltip.textContent = binding.value.text;
    el.tooltip = tooltip;
    document.body.appendChild(tooltip);

    let showTimeout;

    const positionTooltip = (position) => {
      const {
        top, left, width, height,
      } = el.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      const positions = {
        top: {
          top: `${top - tooltipHeight - 5}px`,
          left: `${left + width / 2 - tooltipWidth / 2}px`,
        },
        bottom: {
          top: `${top + height + 5}px`,
          left: `${left + width / 2 - tooltipWidth / 2}px`,
        },
        left: {
          top: `${top + height / 2 - tooltipHeight / 2}px`,
          left: `${left - tooltipWidth - 5}px`,
        },
        right: {
          top: `${top + height / 2 - tooltipHeight / 2}px`,
          left: `${left + width + 5}px`,
        },
      };

      const pos = positions[position] || positions.top;
      tooltip.style.top = pos.top;
      tooltip.style.left = pos.left;
      tooltip.style.opacity = '1';
    };

    const showTooltip = () => {
      const position = binding.value.position || 'top';
      clearTimeout(showTimeout);
      showTimeout = setTimeout(() => positionTooltip(position), binding.value.delay || 0);
    };

    const hideTooltip = () => {
      clearTimeout(showTimeout);
      tooltip.style.opacity = '0';
    };

    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);

    el.cleanup = () => {
      el.removeEventListener('mouseenter', showTooltip);
      el.removeEventListener('mouseleave', hideTooltip);
      document.body.removeChild(tooltip);
      clearTimeout(showTimeout);
    };
  },
  updated(el, binding) {
    el.tooltip.textContent = binding.value.text;
  },
  unmounted(el) {
    el.cleanup();
  },
};
