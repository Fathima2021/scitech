import axios from 'axios';
import Koa from 'koa';
import { createError } from '../utils/createError';
/** search controller  */

/** Get advanced search data */

export const getAdvancedSearch = async (ctx: Koa.Context) => {
  const { fromDate, toDate, tag, caseId, allOfWords, anyOfWords, exactWord, noneOfWords, isDeleted } = ctx.request.body;
  try {
    let isDateTag = false;
    let isFirstCondition = true;
    let QueryString = 'select * from tblLibraryItems where';
    // if (fromDate) {
    // QueryString = QueryString + `${isFirstCondition ? '' : ' and '} modified >= ${fromDate}`;
    // QueryString =   `'CAST(modified as date) BETWEEN '+ ${fromDate} +' and ' + ${fromDate}` ;
    //isDateTag = true;
    //isFirstCondition = false;
    //}
    if (fromDate && toDate) {
      // QueryString = QueryString + `${isFirstCondition ? '' : ' and '} modified <= ${toDate}`;
      QueryString = QueryString + ` CAST(modified as date) BETWEEN  '${fromDate}' and  '${toDate}'`;

      isDateTag = true;
      isFirstCondition = false;
    }
    if (tag) {
      QueryString = QueryString + `${isFirstCondition ? '' : ' and '} tag like '%${tag}%'`;
      isDateTag = true;
      isFirstCondition = false;
    }

    // all of words
    if (allOfWords) {
      let allwordQuery;
      let title = '';
      let keywords = '';
      allOfWords.map((word: any, index: any) => {
        if (word) {
          title = title + `  title like '%${word}%' ${index === allOfWords.length - 1 ? '' : 'and'}`;
          keywords = keywords + `  keywords like '%${word}%' ${index === allOfWords.length - 1 ? '' : 'and'}`;
        }
      });

      allwordQuery = `( (${title}) or (${keywords}) )`;
      QueryString = QueryString + `${isDateTag ? ' and ' : ''}  ${allwordQuery}`;
    }
    // any of words
    if (anyOfWords) {
      if (allOfWords) {
        createError(400, 'Only one condition is allowed!');
      }
      let anywordQuery;
      let title = '';
      let keywords = '';
      anyOfWords.map((word: any, index: any) => {
        if (word) {
          title = title + `  title like '%${word}%' ${index === anyOfWords.length - 1 ? '' : 'or'}`;
          keywords = keywords + `  keywords like '%${word}%' ${index === anyOfWords.length - 1 ? '' : 'or'}`;
        }
      });

      anywordQuery = `( (${title}) or (${keywords}) )`;
      QueryString = QueryString + ` ${isDateTag ? ' and ' : ''}  ${anywordQuery}`;
    }
    // ExactWord
    if (exactWord) {
      if (anyOfWords || anyOfWords) {
        createError(400, 'Only one condition is allowed!');
      }
      QueryString =
        QueryString + `  ${isDateTag ? ' and ' : ''} ((title like '${exactWord}' ) or (keywords like '${exactWord}'))`;
    }
    // none of words
    if (noneOfWords) {
      if (anyOfWords || anyOfWords || exactWord) {
        createError(400, 'Only one condition is allowed!');
      }
      let nonewordQuery;
      let title = '';
      let keywords = '';
      noneOfWords.map((word: any, index: any) => {
        if (word) {
          title = title + `  title not like '%${word}%' ${index === noneOfWords.length - 1 ? '' : 'and'}`;
          keywords = keywords + `  keywords not like '%${word}%' ${index === noneOfWords.length - 1 ? '' : 'and'}`;
        }
      });
      nonewordQuery = `( (${title}) or (${keywords}) )`;
      QueryString = QueryString + ` ${isDateTag ? ' and ' : ''}  ${nonewordQuery}`;
    }
    if (!isDeleted) {
      QueryString = QueryString + ` and status = 1`;
    }

    if (caseId) {
      QueryString = QueryString + ` and case_id = '${caseId}'`;
    }
    console.log('QueryString', QueryString);

    const data = await ctx.rawDb.query(QueryString, { type: ctx.rawDb.QueryTypes.SELECT });
    ctx.body = { status: 1, data };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** Full-Text search by title,keywords,tags,name fields */

export const fullTextSearch = async (ctx: Koa.Context) => {
  const { term, caseId, elasticEnabled } = ctx.query;
  if (elasticEnabled === 'true') {
    const payload = {
      query: {
        multi_match: {
          query: term,
          caseId,
          fields: ['title', 'keywords', 'tag', 'name']
        }
      }
    };
    await axios.post('http://194.233.82.129:9200/docs/_search', payload).then((res) => {
      ctx.body = res.data;
    });
  } else {
    let data = await ctx.rawDb.query(
      `select * from tblLibraryItems
      where (status = 1) 
      and (lower(cast(title as varchar)) like lower('%${term}%')
      or lower(cast(keywords as varchar)) like lower('%${term}%')
      or lower(cast(tag as varchar)) like lower('%${term}%'))
      and case_id = ${caseId};
      `,
      { type: ctx.rawDb.QueryTypes.SELECT }
    );
    let dataArr: any = [];
    if (data && data.length > 0) {
      data.forEach((object: any) => {
        dataArr.push({ _source: object });
      });
    }
    ctx.body = {
      hits: {
        hits: dataArr
      }
    };
  }
};
