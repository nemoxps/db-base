let test = require('tape');

let DBBase = require('../');


test('DBBase', (t) => {
    t.test('arguments', (t) => {
        let size = (obj) => Object.keys(obj).length;
        
        let DB = new DBBase();
        t.equal(size(DB.db), 0);
        t.equal(size(DB.filters), 0);
        
        DB = new DBBase({ id1: {}, id2: {} }, {
            filters: { filter1: () => false, filter2: () => false },
            filterMixin: () => true,
        });
        t.equal(size(DB.db), 2);
        t.equal(size(DB.filters), 2);
        t.equal(DB.filterMixin(), true);
        
        DB = new DBBase([{ id1: {} }, { id2: {} }], {
            filters: [{ filter1: () => false }, { filter2: () => false }],
            filterMixin: () => true,
        });
        t.equal(size(DB.db), 2);
        t.equal(size(DB.filters), 2);
        t.equal(DB.filterMixin(), true);
        
        t.end();
    });
    
    t.test('methods', (t) => {
        t.test('filter', (t) => {
            let DB = new DBBase(
                {
                    uid1: { name: '1' },
                    id2: { name: '2' },
                    id3: { name: '3' },
                    id4: { name: '#4' },
                },
                {
                    filters: {
                        f1: (q) => {
                            if (q.startsWith('#'))
                              return;
                            return (entry) => entry.name === q;
                        },
                        f2: (q) => {
                            if (!q.startsWith('#'))
                              return;
                            return (entry, id) => id.startsWith(q.slice(1));
                        },
                    },
                }
            );
            t.deepEqual(DB.filter(''), []);
            t.deepEqual(DB.filter('1'), [{ name: '1' }]);
            t.deepEqual(DB.filter('#4'), []);
            t.deepEqual(DB.filter('#id'), [{ name: '2' }, { name: '3' }, { name: '#4' }]);
            t.deepEqual(DB.filter(['#id']), [{ name: '2' }, { name: '3' }, { name: '#4' }]);
            t.deepEqual(DB.filter(['#id', '3']), [{ name: '3' }]);
            
            t.end();
        });
        
        t.end();
    });
    
    t.end();
});