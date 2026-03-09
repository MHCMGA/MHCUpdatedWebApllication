import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import usStatesTopoJson from "us-atlas/states-10m.json";
import carrierCoverageData from "./carrierCoverageData.json";

type CarrierCoverageEntry = {
  carrier: string;
  states: string[];
};

const coveredFill = "#0d8ab0";
const uncoveredFill = "#ffffff";
const boundaryColor = "#c8dbe3";

function buildCarrierLookup(entries: CarrierCoverageEntry[]): Map<string, string[]> {
  const lookup = new Map<string, Set<string>>();

  for (const entry of entries) {
    for (const state of entry.states) {
      const key = state.toLowerCase();
      const carriers = lookup.get(key) ?? new Set<string>();
      carriers.add(entry.carrier);
      lookup.set(key, carriers);
    }
  }

  return new Map(Array.from(lookup.entries()).map(([state, carriers]) => [state, Array.from(carriers)]));
}

export default function StateCoverageMap(): JSX.Element {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const carrierLookup = useMemo(
    () => buildCarrierLookup(carrierCoverageData as CarrierCoverageEntry[]),
    []
  );

  return (
    <section className="panel coverage-panel" aria-labelledby="state-coverage-title">
      <h3 id="state-coverage-title">Where We Write</h3>
      <p className="coverage-subtitle">Hover a state to see which carrier(s) are available there.</p>

      <div className="coverage-map-wrap">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1200 }}
          width={975}
          height={610}
          className="coverage-map"
          aria-label="United States coverage map"
        >
          <Geographies geography={usStatesTopoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = String(geo.properties.name ?? "");
                const carriers = carrierLookup.get(stateName.toLowerCase()) ?? [];
                const fill = carriers.length > 0 ? coveredFill : uncoveredFill;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={boundaryColor}
                    strokeWidth={1}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <p className="coverage-legend">
        <span className="legend-item">
          <span className="legend-swatch legend-swatch-covered" /> We write in this state
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-swatch-uncovered" /> We do not write in this state
        </span>
      </p>

      <p className="coverage-hover-readout">
        {hoveredState
          ? (() => {
              const carriers = carrierLookup.get(hoveredState.toLowerCase()) ?? [];
              if (carriers.length === 0) {
                return `${hoveredState}: Not currently written`;
              }

              return `${hoveredState}: ${carriers.join(", ")}`;
            })()
          : "Hover over a state to view carrier availability."}
      </p>
    </section>
  );
}
