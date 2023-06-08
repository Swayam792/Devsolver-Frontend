import { formatDistanceToNowStrict } from 'date-fns'; 

export const getErrorMsg = (err) => {
    if (err.graphQLErrors[0]?.message) {
        return err.graphQLErrors[0].message;
    } else {
        return err?.message;
    }
}

export const formatDateAgo = (date) => {
    return formatDistanceToNowStrict(new Date(date));
};

export const formatDayTime = (date) => {
    return new Date(date);
    // return format(new Date(date), "MMM d', ' yy 'at' H':'mm");
};  

export const filterDuplicates = (originalArr, arrToConcat) => {
    return arrToConcat.filter((a) => !originalArr.find((o) => o.id === a.id));
}

