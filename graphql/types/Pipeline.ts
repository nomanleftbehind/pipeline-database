import { enumType, intArg, objectType, stringArg, extendType, inputObjectType, nonNull, arg, floatArg, booleanArg } from 'nexus';
import { NexusGenObjects } from 'nexus-typegen';
import { Context } from '../context';
import { Pipeline as IPipeline } from '@prisma/client';
import { StatusEnumMembers, SubstanceEnumMembers, StatusEnumArray, SubstanceEnumArray } from './LicenseChange';
import { totalPipelineFlowRawQuery } from './PipelineFlow';
import { Prisma, User as IUser } from '@prisma/client';
import { ITableConstructObject } from './SearchNavigation';



export const MaterialEnumMembers = {
  Steel: "Steel",
  PolyvinylChloride: "Polyvinyl Chloride",
  Composite: "Composite",
  Fiberglass: "Fiberglass",
  Aluminum: "Aluminum",
  Polyethylene: "Polyethylene",
  CelluloseAcetateButyrate: "Cellulose Acetate Butyrate",
  Unknown: "Unknown",
  AsbestosCement: "Asbestos Cement"
}

export const MaterialEnum = enumType({
  sourceType: {
    module: '@prisma/client',
    export: 'MaterialEnum',
  },
  name: 'MaterialEnum',
  members: MaterialEnumMembers
});

export const MaterialEnumArray: NexusGenObjects['EnumObject'][] = Object.entries(MaterialEnumMembers).map(([serverEnum, databaseEnum]) => {
  return { serverEnum, databaseEnum }
});

export const InternalProtectionEnumMembers = {
  Uncoated: "Uncoated",
  FreeStandingSlipLined: "Free Standing (Slip Lined)",
  Unknown: "Unknown",
  Cement: "Cement",
  ExpandedPolyethylene: "Expanded Polyethylene",
  ThinFilm: "Thin Film",
}

export const InternalProtectionEnum = enumType({
  sourceType: {
    module: '@prisma/client',
    export: 'InternalProtectionEnum',
  },
  name: 'InternalProtectionEnum',
  members: InternalProtectionEnumMembers
});

export const InternalProtectionEnumArray: NexusGenObjects['EnumObject'][] = Object.entries(InternalProtectionEnumMembers).map(([serverEnum, databaseEnum]) => {
  return { serverEnum, databaseEnum }
});

export const FlowCalculationDirectionEnumMembers = {
  Upstream: 'Upstream',
  Downstream: 'Downstream',
}

export const FlowCalculationDirectionEnum = enumType({
  sourceType: {
    module: '@prisma/client',
    export: 'FlowCalculationDirectionEnum',
  },
  name: 'FlowCalculationDirectionEnum',
  members: FlowCalculationDirectionEnumMembers
});

export const FlowCalculationDirectionEnumArray: NexusGenObjects['EnumObject'][] = Object.entries(FlowCalculationDirectionEnumMembers).map(([serverEnum, databaseEnum]) => {
  return { serverEnum, databaseEnum }
});


export const PipelineObjectFields: ITableConstructObject[] = [
  { field: 'id', nullable: false, type: 'String' },
  { field: 'license', nullable: false, type: 'String' },
  { field: 'segment', nullable: false, type: 'String' },
  { field: 'flowCalculationDirection', nullable: false, type: 'FlowCalculationDirectionEnum', enumObjectArray: FlowCalculationDirectionEnumArray },
  { field: 'from', nullable: false, type: 'String' },
  { field: 'fromFeatureId', nullable: true, type: 'String' },
  { field: 'to', nullable: false, type: 'String' },
  { field: 'toFeatureId', nullable: true, type: 'String' },
  { field: 'pipelineTypeId', nullable: true, type: 'String' },
  { field: 'pipelineGradeId', nullable: true, type: 'String' },
  { field: 'material', nullable: true, type: 'MaterialEnum', enumObjectArray: MaterialEnumArray },
  { field: 'internalProtection', nullable: true, type: 'InternalProtectionEnum', enumObjectArray: InternalProtectionEnumArray },
  { field: 'currentStatus', nullable: true, type: 'StatusEnum', enumObjectArray: StatusEnumArray },
  { field: 'currentSubstance', nullable: true, type: 'SubstanceEnum', enumObjectArray: SubstanceEnumArray },
  { field: 'firstLicenseDate', nullable: true, type: 'DateTime' },
  { field: 'length', nullable: false, type: 'Float' },
  { field: 'yieldStrength', nullable: true, type: 'Int' },
  { field: 'outsideDiameter', nullable: true, type: 'Float' },
  { field: 'wallThickness', nullable: true, type: 'Float' },
  { field: 'mop', nullable: true, type: 'Int' },
  { field: 'piggable', nullable: true, type: 'Boolean' },
  { field: 'piggingFrequency', nullable: true, type: 'Int' },
  { field: 'createdAt', nullable: false, type: 'DateTime' },
  { field: 'updatedAt', nullable: false, type: 'DateTime' },
];



export const Pipeline = objectType({
  name: 'Pipeline',
  sourceType: {
    module: '@prisma/client',
    export: 'Pipeline',
  },
  definition: t => {
    for (const { field, nullable, type } of PipelineObjectFields) {
      const nullability = nullable ? 'nullable' : 'nonNull';

      t[nullability].field(field, {
        type,
        resolve:
          field === 'currentStatus' ?
            async ({ id }, _args, ctx: Context) => {
              const { status } = await ctx.prisma.licenseChange.findFirst({
                where: { pipelineId: id },
                orderBy: { date: 'desc' },
                select: { status: true },
              }) || {};
              const result = status && serverEnumToDatabaseEnum(StatusEnumMembers, status) || null;
              return result;
            } :
            field === 'currentSubstance' ?
              async ({ id }, _args, ctx: Context) => {
                const { substance } = await ctx.prisma.licenseChange.findFirst({
                  where: { pipelineId: id },
                  orderBy: { date: 'desc' },
                  select: { substance: true },
                }) || {};
                const result = substance && serverEnumToDatabaseEnum(SubstanceEnumMembers, substance) || null;
                return result;
              } :
              field === 'firstLicenseDate' ?
                async ({ id }, _args, ctx: Context) => {
                  const { date } = await ctx.prisma.licenseChange.findFirst({
                    where: { pipelineId: id },
                    orderBy: { date: 'asc' },
                    select: { date: true },
                  }) || {};
                  return date || null;
                } :
                field === 'material' ?
                  ({ material }) => {
                    const result = material && serverEnumToDatabaseEnum(MaterialEnumMembers, material);
                    return result;
                  } :
                  field === 'internalProtection' ?
                    ({ internalProtection }) => {
                      const result = internalProtection && serverEnumToDatabaseEnum(InternalProtectionEnumMembers, internalProtection);
                      return result;
                    } :
                    undefined,
      });
    }
  }
});


export const PipelineExtendObject = extendType({
  type: 'Pipeline',
  definition: t => {
    t.field('satellite', {
      type: 'Satellite',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).satellite();
        return result!
      },
    })
    t.list.field('wells', {
      type: 'Well',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).wells();
        return result;
      },
    })
    t.list.field('salesPoints', {
      type: 'SalesPoint',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).salesPoints();
        return result;
      },
    })
    t.nonNull.field('createdBy', {
      type: 'User',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).createdBy()
        return result!;
      },
    })
    t.nonNull.field('updatedBy', {
      type: 'User',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).updatedBy()
        return result!;
      },
    })
    t.list.field('pressureTests', {
      type: 'PressureTest',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).pressureTests();
        return result;
      },
    })
    t.list.field('pigRuns', {
      type: 'PigRun',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).pigRuns();
        return result;
      },
    })
    t.list.field('licenseChanges', {
      type: 'LicenseChange',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).licenseChanges();
        return result;
      }
    })
    t.field('risk', {
      type: 'Risk',
      resolve: async ({ id }, _args, ctx: Context) => {
        const result = await ctx.prisma.pipeline.findUnique({
          where: { id },
        }).risk();
        return result;
      }
    })
    t.list.field('upstream', {
      type: 'Pipeline',
      resolve: ({ id }, _args, ctx: Context) => {
        return ctx.prisma.pipeline.findMany({
          where: { upstream: { some: { downstreamId: id } } },
        })
      },
    })
    t.list.field('downstream', {
      type: 'Pipeline',
      resolve: ({ id }, _args, ctx: Context) => {
        return ctx.prisma.pipeline.findMany({
          where: { downstream: { some: { upstreamId: id } } },
        })
      },
    })
    t.nonNull.boolean('authorized', {
      resolve: async (_, _args, ctx: Context) => {
        const user = ctx.user;
        return !!user && resolvePipelineAuthorized(user);
      }
    })
  },
});




export const resolvePipelineAuthorized = (user: IUser) => {
  const { role } = user;
  return role === 'ADMIN' || role === 'ENGINEER';
}


export const PipelinesByIdPayload = objectType({
  name: 'PipelinesByIdPayload',
  definition: t => {
    t.list.field('pipelines', { type: 'Pipeline' })
    t.nonNull.int('count')
  },
});


export const PipelineQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('connectedPipelinesByPipelineId', {
      type: 'PipelinesFlowAndSourceGroupBy',
      args: {
        id: nonNull(stringArg()),
        flowCalculationDirection: nonNull(arg({ type: 'FlowCalculationDirectionEnum' })),
      },
      resolve: async (_, { id, flowCalculationDirection }, ctx: Context) => {

        if (flowCalculationDirection === 'Upstream') {
          const { downstream } = await ctx.prisma.pipeline.findUnique({
            where: { id },
            select: {
              downstream: { select: { upstreamId: true } },
            },
          }) || {};
          if (downstream && downstream.length > 0) {

            const idList = downstream.map(({ upstreamId }) => upstreamId);
            const pipelinesFlow = await totalPipelineFlowRawQuery({ idList, flowCalculationDirection, ctx });

            if (pipelinesFlow.length > 0) {
              const pipelineGroupBy = pipelinesFlow.reduce((
                { oil: previousOil, water: previousWater, gas: previousGas, lastProduction: previousLastProduction, lastInjection: previousLastInjection, firstProduction: previousFirstProduction, firstInjection: previousFirstInjection },
                { oil: currentOil, water: currentWater, gas: currentGas, lastProduction: currentLastProduction, lastInjection: currentLastInjection, firstProduction: currentFirstProduction, firstInjection: currentFirstInjection }) => {

                return {
                  oil: previousOil + currentOil,
                  water: previousWater + currentWater,
                  gas: previousGas + currentGas,
                  lastProduction: currentLastProduction > previousLastProduction || (currentLastProduction != null && previousLastProduction == null) ? currentLastProduction : previousLastProduction,
                  lastInjection: currentLastInjection > previousLastInjection || (currentLastInjection != null && previousLastInjection == null) ? currentLastInjection : previousLastInjection,
                  firstProduction: currentFirstProduction < previousFirstProduction || (currentFirstProduction != null && previousFirstProduction == null) ? currentFirstProduction : previousFirstProduction,
                  firstInjection: currentFirstInjection < previousFirstInjection || (currentFirstInjection != null && previousFirstInjection == null) ? currentFirstInjection : previousFirstInjection,
                  id: '',
                  name: ''
                }
              });
              const { oil, water, gas, lastProduction, lastInjection, firstProduction, firstInjection } = pipelineGroupBy;
              const sourceGroupBy = { oil, water, gas, lastProduction, lastInjection, firstProduction, firstInjection }

              return { pipelinesFlow, sourceGroupBy };
            }
          }
        }
        if (flowCalculationDirection === 'Downstream') {
          const { upstream } = await ctx.prisma.pipeline.findUnique({
            where: { id },
            select: {
              upstream: { select: { downstreamId: true } },
            },
          }) || {};
          if (upstream && upstream.length > 0) {

            const idList = upstream.map(({ downstreamId }) => downstreamId);
            const pipelinesFlow = await totalPipelineFlowRawQuery({ idList, flowCalculationDirection, ctx });

            if (pipelinesFlow.length > 0) {
              const pipelineGroupBy = pipelinesFlow.reduce((
                { oil: previousOil, water: previousWater, gas: previousGas, lastProduction: previousLastProduction, lastInjection: previousLastInjection, firstProduction: previousFirstProduction, firstInjection: previousFirstInjection },
                { oil: currentOil, water: currentWater, gas: currentGas, lastProduction: currentLastProduction, lastInjection: currentLastInjection, firstProduction: currentFirstProduction, firstInjection: currentFirstInjection }) => {

                return {
                  oil: previousOil + currentOil,
                  water: previousWater + currentWater,
                  gas: previousGas + currentGas,
                  lastProduction: currentLastProduction > previousLastProduction || (currentLastProduction != null && previousLastProduction == null) ? currentLastProduction : previousLastProduction,
                  lastInjection: currentLastInjection > previousLastInjection || (currentLastInjection != null && previousLastInjection == null) ? currentLastInjection : previousLastInjection,
                  firstProduction: currentFirstProduction < previousFirstProduction || (currentFirstProduction != null && previousFirstProduction == null) ? currentFirstProduction : previousFirstProduction,
                  firstInjection: currentFirstInjection < previousFirstInjection || (currentFirstInjection != null && previousFirstInjection == null) ? currentFirstInjection : previousFirstInjection,
                  id: '',
                  name: ''
                }
              });
              const { oil, water, gas, lastProduction, lastInjection, firstProduction, firstInjection } = pipelineGroupBy;
              const sourceGroupBy = { oil, water, gas, lastProduction, lastInjection, firstProduction, firstInjection }

              return { pipelinesFlow, sourceGroupBy };
            }
          }
        }
        return null;
      }
    })
    t.nonNull.field('pipelinesById', {
      type: 'PipelinesByIdPayload',
      args: {
        navigationInput: nonNull(arg({ type: 'NavigationInput' })),
        skip: nonNull(intArg()),
        take: nonNull(intArg()),
      },
      resolve: async (_, { navigationInput: { hierarchy, search }, skip, take }, ctx: Context) => {

        if (hierarchy) {
          const { id, table } = hierarchy;
          if (table === 'satellite') {
            const where = { satelliteId: id };
            const count = await ctx.prisma.pipeline.count({ where });
            const pipelines = await ctx.prisma.pipeline.findMany({
              where,
              skip,
              take,
              orderBy: [
                { license: 'asc' },
                { segment: 'asc' },
              ]
            });
            return { pipelines, count };
          } else if (table === 'facility' && id === 'no-facility') {
            const where = { satellite: { facilityId: null } };
            const count = await ctx.prisma.pipeline.count({ where });
            const pipelines = await ctx.prisma.pipeline.findMany({
              where,
              skip,
              take,
              orderBy: [
                { license: 'asc' },
                { segment: 'asc' },
              ]
            });
            return { pipelines, count };
          } else if (table === 'facility' && id) {
            const where = { satellite: { facilityId: id } };
            const count = await ctx.prisma.pipeline.count({ where });
            const pipelines = await ctx.prisma.pipeline.findMany({
              where,
              skip,
              take,
              orderBy: [
                { license: 'asc' },
                { segment: 'asc' },
              ]
            });
            return { pipelines, count };
          } else {
            const count = await ctx.prisma.pipeline.count();
            const pipelines = await ctx.prisma.pipeline.findMany({
              skip,
              take,
              orderBy: [
                { license: 'asc' },
                { segment: 'asc' },
              ]
            });
            return { pipelines, count };
          }
        }

        if (search) {

          const query = await Promise.all(search.map(async ({ table, field, having, operation, value, type }) => {
            console.log({ table, field, having, operation, value, type });

            const castValue =
              type === 'Int' ? parseInt(value) :
                type === 'Float' ? Number(value) :
                  type === 'DateTime' ? new Date(value) :
                    type === 'Boolean' ? value === 'true' ? true : false : value

            if (table === 'pipeline') {
              // self relation
              return {
                [field]: { [operation]: castValue },
              }
            } else if (table === 'risk' || table === 'chemical') {
              // one-to-one relation
              return {
                [table]: {
                  [field]: { [operation]: castValue },
                }
              };
            } else if (table === 'downstream' || table === 'upstream') {
              // many-to-many relations
              const opposite = table === 'downstream' ? 'upstream' : 'downstream';

              if (having === '_any') {
                return {
                  [opposite]: {
                    some: {
                      [table]: {
                        [field]: { [operation]: castValue },
                      }
                    }
                  }
                }
              } else if (having === '_count') {

                if ((operation === 'equals' || operation === 'lte') && castValue === 0) {
                  // This filter returns pipelines that have zero related records of specified table
                  return {
                    [opposite]: {
                      none: {}
                    }
                  }
                } else if (operation === 'gte' && castValue === 0) {
                  // This filter effectively returns all pipelines
                  return {}
                } else if (operation === 'lt' && castValue === 0) {
                  // It's impossible to have count less than 0 so filter needs to return zero pipelines. ID is never an empty string so this will do the job.
                  return {
                    id: ''
                  }
                } else if ((operation === 'gt' && castValue === 0) || (operation === 'gte' && castValue === 1)) {
                  // This filter returns pipelines with at least one related record of specified table. This condition would have been captured later but in this specific case we can write a much less expensive query.
                  return {
                    [opposite]: {
                      some: {}
                    }
                  }
                } else {
                  const pipelineIds: string[] = [];
                  if (table === 'downstream') {
                    for (const { upstreamId } of await ctx.prisma.pipelinesOnPipelines.groupBy({
                      by: ['upstreamId'],
                      having: {
                        downstreamId: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(upstreamId)
                    }
                  } else if (table === 'upstream') {
                    for (const { downstreamId } of await ctx.prisma.pipelinesOnPipelines.groupBy({
                      by: ['downstreamId'],
                      having: {
                        upstreamId: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(downstreamId)
                    }
                  }
                  return {
                    id: {
                      in: pipelineIds
                    }
                  }
                }
              } else {
                // TODO implement search navigation for _min and _max 'Having' for numeric and date fields of upstream and downstream pipelines
              }
            } else if (table !== 'facility' && table !== 'satellite') {
              // one-to-many relations
              if (having === '_any') {
                return {
                  [table]: {
                    some: {
                      [field]: { [operation]: castValue },
                    }
                  }
                };
              } else if (having === '_count' && (operation === 'equals' || operation === 'lte') && castValue === 0) {
                // This filter returns pipelines that have zero related records of specified table
                return {
                  [table]: {
                    none: {}
                  }
                }
              } else if (having === '_count' && operation === 'gte' && castValue === 0) {
                // This filter effectively returns all pipelines
                return {}
              } else if (having === '_count' && operation === 'lt' && castValue === 0) {
                // It's impossible to have count less than 0 so filter needs to return zero pipelines. ID is never an empty string so this will do the job.
                return {
                  id: ''
                }
              } else if (having === '_count' && ((operation === 'gt' && castValue === 0) || (operation === 'gte' && castValue === 1))) {
                // This filter returns pipelines with at least one related record of specified table. This condition would have been captured later but in this specific case we can write a query that's much less expensive.
                return {
                  [table]: {
                    some: {}
                  }
                }
              } else {
                const pipelineIds: string[] = [];
                if (table === 'licenseChanges') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.licenseChange.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId)
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.licenseChange.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId)
                    }
                  }
                } else if (table === 'wells') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.well.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      if (pipelineId) {
                        pipelineIds.push(pipelineId);
                      }
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.well.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      if (pipelineId) {
                        pipelineIds.push(pipelineId);
                      }
                    }
                  }
                } else if (table === 'salesPoints') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.salesPoint.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      if (pipelineId) {
                        pipelineIds.push(pipelineId);
                      }
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.salesPoint.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      if (pipelineId) {
                        pipelineIds.push(pipelineId);
                      }
                    }
                  }
                } else if (table === 'pigRuns') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.pigRun.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.pigRun.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  }
                } else if (table === 'pressureTests') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.pressureTest.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.pressureTest.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  }
                } else if (table === 'pipelineBatches') {
                  if (having === '_count') {
                    for (const { pipelineId } of await ctx.prisma.pipelineBatch.groupBy({
                      by: ['pipelineId'],
                      having: {
                        id: {
                          _count: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  } else {
                    for (const { pipelineId } of await ctx.prisma.pipelineBatch.groupBy({
                      by: ['pipelineId'],
                      having: {
                        [field]: {
                          [having]: {
                            [operation]: castValue
                          }
                        }
                      }
                    })) {
                      pipelineIds.push(pipelineId);
                    }
                  }
                }
                return {
                  id: {
                    in: pipelineIds
                  }
                }
              }
            }
          }
          ));

          console.log(JSON.stringify(query));

          const where = { AND: query, };
          const count = await ctx.prisma.pipeline.count({ where });
          const pipelines = await ctx.prisma.pipeline.findMany({
            where,
            skip,
            take,
          });
          return { pipelines, count };
        }
        return { pipelines: null, count: 0 };
      }
    })
  },
});


export const NavigationInput = inputObjectType({
  name: 'NavigationInput',
  definition(t) {
    t.field('hierarchy', { type: 'HierarchyInput' })
    t.list.nonNull.field('search', { type: 'SearchNavigationInput' })
  },
});

export const HierarchyInput = inputObjectType({
  name: 'HierarchyInput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.field('table', { type: 'TableEnum' })
  },
});

export const SearchNavigationInput = inputObjectType({
  name: 'SearchNavigationInput',
  definition(t) {
    t.nonNull.field('table', { type: 'TableEnum' })
    t.nonNull.string('field')
    t.nonNull.string('value')
    t.nonNull.string('type')
    t.nonNull.field('having', { type: 'HavingEnum' })
    t.nonNull.field('operation', { type: 'OperationEnum' })
  },
});


export const PipelineCreateInput = inputObjectType({
  name: 'PipelineCreateInput',
  definition(t) {
    t.list.field('wells', { type: 'WellCreateInput' })
    t.nonNull.string('license')
    t.nonNull.string('segment')
    t.nonNull.string('from')
    t.nonNull.string('to')
    t.nonNull.float('length')
    t.float('outsideDiameter')
    t.float('wallThickness')
    t.field('material', { type: 'MaterialEnum' })
    t.int('mop')
    t.field('internalProtection', { type: 'InternalProtectionEnum' })
    t.list.field('upstream', { type: 'PipelineCreateInput' })
    t.list.field('downstream', { type: 'PipelineCreateInput' })
  },
})


export function serverEnumToDatabaseEnum<T>(object: T, key: keyof T) {
  return object[key] as unknown as keyof T;
}

export function databaseEnumToServerEnum<T>(object: T, value: T[keyof T] | null | undefined) {
  // This step is necessary because otherwise, function would return undefined if null was passed for value.
  // In GraphQL and context of this function, undefined means `do nothing`, null means set field to null.
  if (value === null) {
    return null;
  }
  const keys = Object.keys(object) as (keyof T)[];
  const result = keys.find(key => object[key] === value);
  return result;
}


export const PipelinePayload = objectType({
  name: 'PipelinePayload',
  definition(t) {
    t.field('pipeline', { type: 'Pipeline' })
    t.field('error', { type: 'FieldError' })
  },
});

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type IPipelinePartialBy = PartialBy<IPipeline, 'id' | 'createdAt' | 'updatedAt'>

export const PipelineMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('editPipeline', {
      type: 'PipelinePayload',
      args: {
        id: nonNull(stringArg()),
        satelliteId: stringArg(),
        license: stringArg(),
        segment: stringArg(),
        flowCalculationDirection: arg({ type: 'FlowCalculationDirectionEnum' }),
        from: stringArg(),
        fromFeatureId: stringArg(),
        to: stringArg(),
        toFeatureId: stringArg(),
        licenseDate: arg({ type: 'DateTime' }),
        length: floatArg(),
        pipelineTypeId: stringArg(),
        pipelineGradeId: stringArg(),
        yieldStrength: intArg(),
        outsideDiameter: floatArg(),
        wallThickness: floatArg(),
        material: arg({ type: 'MaterialEnum' }),
        mop: intArg(),
        internalProtection: arg({ type: 'InternalProtectionEnum' }),
        piggable: booleanArg(),
        piggingFrequency: intArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        const user = ctx.user;
        if (user) {
          const { id: userId, firstName } = user;
          const authorized = resolvePipelineAuthorized(user);
          if (authorized) {
            if (args.license) {
              const currentPipeline = await ctx.prisma.pipeline.findUnique({
                where: { id: args.id },
                select: {
                  segment: true,
                }
              });
              if (currentPipeline) {
                const { segment } = currentPipeline;
                const pipelineWithSameSegment = await ctx.prisma.pipeline.findUnique({
                  where: { license_segment: { license: args.license, segment } },
                  select: {
                    id: true,
                    satellite: {
                      select: {
                        name: true,
                        facility: {
                          select: {
                            name: true,
                          }
                        }
                      }
                    }
                  }
                });
                if (pipelineWithSameSegment && pipelineWithSameSegment.id !== args.id) {
                  const facility = pipelineWithSameSegment.satellite?.facility?.name;
                  const satellite = pipelineWithSameSegment.satellite?.name;
                  return {
                    error: {
                      field: 'license',
                      message: `Pipeline ${args.license}-${segment} already exists at facility ${facility}, satellite ${satellite}.`,
                    }
                  }
                }
              }
            }
            if (args.segment) {
              const currentPipeline = await ctx.prisma.pipeline.findUnique({
                where: { id: args.id },
                select: {
                  license: true,
                }
              });
              if (currentPipeline) {
                const { license } = currentPipeline;
                const pipelineWithSameLicense = await ctx.prisma.pipeline.findUnique({
                  where: { license_segment: { license, segment: args.segment } },
                  select: {
                    id: true,
                    satellite: {
                      select: {
                        name: true,
                        facility: {
                          select: {
                            name: true,
                          }
                        }
                      }
                    }
                  }
                });
                if (pipelineWithSameLicense && pipelineWithSameLicense.id !== args.id) {
                  const facility = pipelineWithSameLicense.satellite?.facility?.name;
                  const satellite = pipelineWithSameLicense.satellite?.name;
                  return {
                    error: {
                      field: 'segment',
                      message: `Pipeline ${license}-${args.segment} already exists at facility ${facility}, satellite ${satellite}.`,
                    }
                  }
                }
              }
            }
            const pipeline = await ctx.prisma.pipeline.update({
              where: { id: args.id },
              data: {
                satelliteId: args.satelliteId,
                license: args.license || undefined,
                segment: args.segment || undefined,
                flowCalculationDirection: args.flowCalculationDirection || undefined,
                from: args.from || undefined,
                fromFeatureId: args.fromFeatureId,
                to: args.to || undefined,
                toFeatureId: args.toFeatureId,
                length: args.length || undefined,
                pipelineTypeId: args.pipelineTypeId,
                pipelineGradeId: args.pipelineGradeId,
                yieldStrength: args.yieldStrength,
                outsideDiameter: args.outsideDiameter,
                wallThickness: args.wallThickness,
                material: databaseEnumToServerEnum(MaterialEnumMembers, args.material),
                mop: args.mop,
                internalProtection: databaseEnumToServerEnum(InternalProtectionEnumMembers, args.internalProtection),
                piggable: args.piggable,
                piggingFrequency: args.piggingFrequency,
                updatedById: userId,
              },
            });
            return { pipeline }
          }
          return {
            error: {
              field: 'User',
              message: `Hi ${firstName}, you are not authorized to make changes to pipelines.`,
            }
          }
        }
        return {
          error: {
            field: 'User',
            message: 'Not authorized',
          }
        }
      }
    })
    t.field('deletePipeline', {
      type: 'PipelinePayload',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx: Context) => {
        const user = ctx.user;
        if (user) {
          const { firstName } = user;
          const authorized = resolvePipelineAuthorized(user);
          if (authorized) {
            try {
              const pipeline = await ctx.prisma.pipeline.delete({
                where: { id },
              });
              return { pipeline }
            } catch (e) {
              if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2003') {
                  return {
                    error: {
                      field: 'Pipeline',
                      message: 'Delete all dependent fields before deleting this pipeline',
                    }
                  }
                }
              }
              throw e;
            }
          }
          return {
            error: {
              field: 'User',
              message: `Hi ${firstName}, you are not authorized to delete pipelines.`,
            }
          }
        }
        return {
          error: {
            field: 'User',
            message: 'Not authorized',
          }
        }
      },
    })
    t.field('duplicatePipeline', {
      type: 'PipelinePayload',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx: Context) => {

        const user = ctx.user;
        if (user) {
          const authorized = resolvePipelineAuthorized(user);
          const { id: userId, firstName } = user;
          if (authorized) {
            const newPipeline = await ctx.prisma.pipeline.findUnique({
              where: { id }
            }) as IPipelinePartialBy | null;

            if (newPipeline) {
              newPipeline.license += '_copy';
              newPipeline.segment += '_copy';
              delete newPipeline.id;
              delete newPipeline.createdAt;
              delete newPipeline.updatedAt;
              newPipeline.createdById = userId;
              newPipeline.updatedById = userId;

              try {
                const pipeline = await ctx.prisma.pipeline.create({
                  data: newPipeline
                });
                return { pipeline }
              } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                  if (e.code === 'P2002') {
                    return {
                      error: {
                        field: 'License and Segment',
                        message: 'There is a unique constraint violation, a new pipeline cannot be created with this license and segment',
                      }
                    }
                  }
                }
                throw e;
              }
            };
            return {
              error: {
                field: 'ID',
                message: `Couldn't find pipeline with ID ${id}.`,
              }
            }
          }
          return {
            error: {
              field: 'User',
              message: `Hi ${firstName}, you are not authorized to create a new pipeline.`,
            }
          }
        }
        return {
          error: {
            field: 'User',
            message: 'Not authorized',
          }
        }
      }
    })
  }
});