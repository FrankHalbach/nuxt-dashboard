<script>
import { Bar } from "vue-chartjs";
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";

export default {
  extends: Bar,
  props: {
    labels: {
      type: Array,
    },
    budget: {
      type: Array,
    },
    current: {
      type: Array,
    },
    actual: {
      type: Array,
    },
    edi: {
      type: Array,
    },
    fcst: {
      type: Array,
    },
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              label: "Budget",
              data: this.budget,
              tension: 0.1,
              borderColor: "black",
              type: "line",
              fill: false,
            },
            {
              label: "Current",
              data: this.current,
              tension: 0.1,
              borderColor: "#7D9EAD",
              type: "line",
              fill: false,
            },
            {
              label: "Actual",
              backgroundColor: "#E57200",
              data: this.actual,
              stack: "combined",
              type: "bar",
            },
            {
              label: "EDI",
              backgroundColor: "grey",
              data: this.edi,
              stack: "combined",
              type: "bar",
            },
            {
              label: "Forecast",
              backgroundColor: "#C2C4C5",
              data: this.fcst,
              stack: "combined",
              type: "bar",
            },
          ],
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: "bottom" },
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: (value, index, ticks) => value + "k",
                },
                display: true,
              },
            ],
          },
          plugins: {
            datalabels: {
              anchor: "end",
              align: "top",
              formatter: (value, context) => {
                const idx = context.dataIndex;
                const act = this.actual[idx] || 0;
                const edi = this.edi[idx] || 0;
                const fcst = this.fcst[idx] || 0;
                const sum = (act + edi + fcst) * 10;
                const rounded = Math.round(sum) / 10;
                const form = new Intl.NumberFormat().format(rounded);
                if (context.dataset.label === "Forecast") return form || "err";
                return null;
              },
            },
          },
        }
      );
    },
  },
  computed: {
    data() {
      return (
        this.labels, this.budget, this.current, this.actual, this.edi, this.fcst
      );
    },
  },

  watch: {
    data: {
      deep: true,
      handler(oldVal, newVal) {
        this.render();
      },
    },
  },
  mounted() {
    this.render();
  },
};
</script>