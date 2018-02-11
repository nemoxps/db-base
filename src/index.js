class DBBase {
    /**
     * @param {(Object|Object[])} [db]
     * @param {Object} [options]
     * @param {(Object|Object[])} [options.filters]
     * @param {function} [options.filterMixin] (): Object
     */
    constructor(db, { filters, filterMixin } = {}) {
        this.db = Object.create(null);
        this.filters = Object.create(null);
        this.filterMixin = () => Object.create(null);
        
        if (db) this.import(db);
        if (filters) this.setFilters(filters);
        if (filterMixin) this.setFilterMixin(filterMixin);
    }
    
    /**
     * @param {(Object|Object[])} importDbs
     * @returns {this}
     */
    import(importDbs) {
        if (!Array.isArray(importDbs))
          importDbs = [importDbs];
        
        let { db } = this;
        for (let importDb of importDbs)
          for (let [id, entry] of Object.entries(importDb))
            db[id] = entry;
        
        return this;
    }
    
    /**
     * @param {(Object|Object[])} importFilters
     * @returns {this}
     */
    setFilters(importFilters) {
        if (!Array.isArray(importFilters))
          importFilters = [importFilters];
        
        let { filters } = this;
        for (let importFilter of importFilters)
          for (let [id, filter] of Object.entries(importFilter))
            filters[id] = filter;
        
        return this;
    }
    /**
     * @param {(string|string[])} filterIds
     * @returns {this}
     */
    deleteFilter(filterIds) {
        if (!Array.isArray(filterIds))
          filterIds = [filterIds];
        
        let { filters } = this;
        for (let filterId of filterIds)
          delete filters[filterId];
        
        return this;
    }
    
    /**
     * @param {function} filterMixin
     * @returns {this}
     */
    setFilterMixin(filterMixin) {
        this.filterMixin = filterMixin;
        
        return this;
    }
    
    /**
     * @param {(*|*[])} q
     * @returns {Object[]}
     */
    filter(q) {
        if (!Array.isArray(q))
          q = [q];
        
        let { db, filters, filterMixin } = this;
        filters = Object.values(filters);
        filterMixin = filterMixin();
        let prepareFilters = (q) => {
            return filters.map((filter) => filter(q, filterMixin)).filter(Boolean);
        };
        let entries = [];
        
        let filtersQ0 = prepareFilters(q[0]);
        for (let entry of Object.entries(db))
          if (filtersQ0.some((filter) => filter(entry[1], entry[0])))
            entries.push(entry);
        for (let qi of q.slice(1))
        {
          let filtersQi = prepareFilters(qi);
          entries = entries.filter(([key, val]) => {
              return filtersQi.some((filter) => filter(val, key));
          });
        }
        
        return entries.map(([, val]) => val);
    }
}


module.exports = DBBase;