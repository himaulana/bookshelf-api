const validate = (data, condition) => {
  const { name, pageCount, readPage } = data;

  if (!name) {
    return {
      isValid: false,
      response: {
        status: 'fail',
        message: `Gagal ${condition} buku. Mohon isi nama buku`,
      },
    };
  }

  if (readPage > pageCount) {
    return {
      isValid: false,
      response: {
        status: 'fail',
        message: `Gagal ${condition} buku. readPage tidak boleh lebih besar dari pageCount`,
      },
    };
  }

  return {
    isValid: true,
    response: null,
  };
};

export default validate;
