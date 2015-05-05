/**
 * Created by awencheong on 2015/3/31.
 */

'use strict';
var UTIL = require('util');

function Sql(){}

/* 生成查询SQL, SQL字段中不能有 除 _ - 之外的特殊符号
 *
 * @param   by: 多个条件进行组合, + 表示与组合， | 表示或组合，例如： by=receiver+start+end, 表示使用三个条件进行 & 查找,
 *              'receiver', 'start', 'end' 为sql中的字段名
 * @param   condition array
 *      condition[0]: 条件1，按照上面的例子，这里合法的一个参数为： awen@qq.com
 *      condition[1]: 条件2，按照上面的列子，这里合法的一个参数为： >=2014-12-15_09:00:00
 *      condition[2]: 条件3，按照上面的例子，这里合法的一个参数为： <=2014-12-15_19:00:00
 *
 *      条件判断动作允许取值范围 ['<', '>', '=', '<=', '>=', '!=']
 *  ......
 *  条件参数 cond{i} 名字必须符合：
 *  1.以前缀cond为开头;
 *  2.后缀{i}是个数字，代表它在 by中的位置，例如 cond2 表示 by=receiver+start+end 的 start
 *  by中的 + 符和 | 符没有优先级的区分，必须用英文()进行分割, 例如： by= receiver+start+end|receiver+start+start 必须写成：
 *  by = (receiver+start+end)|(receiver+start+end)
 *
 *  @return     失败返回false
 *
 *
 *  @Example
 *      var where = Sql.gen_where_sql('(start+end)|(receiver)', ['>2014', '<2015', 'awen@email.com']);
 *      console.log(where); //输出:  where (`start`>"2014" and `end`<"2015") or (`receiver` = "awen@email.com")
 */

Sql.gen_where_sql = function(by, conditions){
    by = by.replace(/\s/g, '');
    var by_arr = by.replace(/[()|+]/g, "%").split("%").filter(function(value){ return value!=''; });
    if (!UTIL.isArray(conditions)) {
        return false;
    }
    if (by_arr.length != conditions.length) {
        return false;
    }

    var  where = '';

    for (var i = 0; i < by_arr.length; i ++) {
        var field = by_arr[i];
        var value = conditions[i].replace(/$\s*/,'').match(/^(>|<|>=|<=|!=|=){0,1}([^<>=!]+)/);   //去掉前面的空格, 正则捕获出 比较操作符 和 比较值
        if (!value) {
            return false;
        }
        if (!value[1]) { //格式:  "value", 添加"=" 符号
            value = "=\"" + value[2] + "\"";
        } else {                    //格式: ">=value", "<value", .....
            value = value[1] + "\"" + value[2] + "\"";
        }

        //将by 分割成两部分:
        where += by.substring(0, by.indexOf(field)).replace(/\+/g, " AND ").replace(/\|/g, " OR ");
        where +=  "`" + field + "`" + value;
        by = by.substring(by.indexOf(field) + field.length);
    }

    where += by;

    return where;
}

module.exports = Sql;
