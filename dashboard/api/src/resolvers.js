const BLOOM_BASE_URL = process.env.BLOOM_BASE_URL || "http://localhost:7474/browser/bloom?perspective=Fraud&search="

export const resolvers = {
    Party: {
        bloomURL: (object, params, ctx, resolveInfo) => {
            return `${process.env.BLOOM_BASE_URL}View+Party+${object.id}`;
        }
    },
    Case: {
        bloomURL: (object, params, ctx, resolveInfo) => {
            return `${process.env.BLOOM_BASE_URL}View+Case+${object.caseId}`
        }
    }
}