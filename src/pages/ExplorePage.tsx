import { TopFilterArea } from '../components/TopFilterArea';
import { useExploreUrl } from '../helpers/explore-url';
import { GridCell, PackedGrid } from '../components/PackedGrid';
import { NamedCard } from '../components/NamedCard';
import { CountryTable } from '../widgets/CountryTable';
import { useQuery } from '../helpers/query-hook';
import { CountryCountSampleData } from '../data/CountryCountSampleDataset';
import { CoreMetrices } from '../widgets/CoreMetrices';
import { MutationData } from '../data/MutationDataset';
import { MutationList } from '../widgets/MutationList';

export const ExplorePage = () => {
  const { selector, setSelector } = useExploreUrl();

  const { data: countryCounts } = useQuery(
    signal => CountryCountSampleData.fromApi(selector, signal),
    [selector]
  );

  const { data: nucMutationCounts } = useQuery(
    signal => MutationData.fromApi(selector, 'nuc', signal),
    [selector]
  );

  /* --- Views --- */

  const topFilters = (
    <>
      <div className='m-8'>
        <TopFilterArea
          location={selector.location!}
          setLocation={newLocation => setSelector({ ...selector, location: newLocation })}
        />
      </div>
    </>
  );

  const mainContent =
    countryCounts && nucMutationCounts ? (
      <>
        <CoreMetrices countryCounts={countryCounts} />
        <PackedGrid maxColumns={2}>
          <GridCell minWidth={600}>
            <NamedCard title='Sequences over time'>Plot</NamedCard>
          </GridCell>
          {!selector.location?.country && (
            <GridCell minWidth={600}>
              <NamedCard title='Geographic distribution'>
                <CountryTable countryCounts={countryCounts} />
              </NamedCard>
            </GridCell>
          )}
          <GridCell minWidth={600}>
            <NamedCard title='Mutations'>
              <MutationList mutations={nucMutationCounts} sequenceType={'nuc'} />
            </NamedCard>
          </GridCell>
        </PackedGrid>
      </>
    ) : (
      'Loading...'
    );

  return (
    <>
      {topFilters}
      {mainContent}
    </>
  );
};
